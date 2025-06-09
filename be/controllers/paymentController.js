const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // Specify a stable API version
});
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Recipe = require("../models/Recipe");
const Notification = require("../models/Notification");
const notificationController = require("./notificationController");

const endpointSecret = process.env.WEBHOOK_SECRET; // Your Stripe webhook signing secret

console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);
console.log(
  "Webhook Secret:",
  process.env.WEBHOOK_SECRET ? "******" : undefined
);

exports.createStripePaymentIntent = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { amount } = req.body;
    if (!amount || amount < 1000)
      return res.status(400).json({ message: "Số tiền không hợp lệ" });

    // Stripe yêu cầu số tiền là cent (1 USD = 100 cent)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // VNĐ, nếu dùng USD thì *100
      currency: "vnd", // hoặc 'usd'
      metadata: { userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);

    res
      .status(500)
      .json({ message: "Lỗi tạo thanh toán Stripe", error: err.message });
  }
};

// Xác nhận nạp tiền sau khi thanh toán thành công (webhook hoặc FE gọi)
exports.confirmStripeTopup = async (req, res) => {
  console.log(
    "Thanh toán tạo transaction : /api/payment/stripe-confirm endpoint was hit!"
  );
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Thanh toán chưa thành công" });
    }
    const userId = paymentIntent.metadata.userId;
    const amount = paymentIntent.amount;

    // Cộng tiền vào ví
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) wallet = await Wallet.create({ user: userId });
    wallet.balance += amount;
    wallet.updatedAt = new Date();
    await wallet.save();

    // Lưu transaction
    // tạo transaction thành công
    console.log("tạo thành công transaction thành công ");
    const transaction1 = await Transaction.create({
      from: null,
      to: userId,
      amount,
      type: "topup",
      method: "stripe",
      status: "success",
    });
    console.log(transaction1);
    // Gửi thông báo nạp tiền
    await notificationController.createNotification(
      userId,
      "topup",
      `Bạn đã nạp ${amount.toLocaleString("vi-VN")}đ vào tài khoản thành công!`,
      { amount }
    );

    res.json({ message: "Nạp tiền thành công", balance: wallet.balance });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi xác nhận nạp tiền", error: err.message });
  }
};

// API lấy số dư ví hiện tại của user
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const wallet = await Wallet.findOne({ user: userId });
    res.json({ balance: wallet ? wallet.balance : 0 });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy số dư ví", error: err.message });
  }
};

// API donate cho tác giả recipe
exports.donateToAuthor = async (req, res) => {
  try {
    const { recipeId, amount, message } = req.body;
    if (!recipeId || !amount || amount < 1000)
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    const userId = req.user.user_id;
    // Lấy recipe để biết tác giả
    const recipe = await Recipe.findById(recipeId);
    if (!recipe)
      return res.status(404).json({ message: "Không tìm thấy recipe" });
    if (recipe.author.toString() === userId)
      return res
        .status(400)
        .json({ message: "Không thể donate cho chính mình" });

    // Tính toán số tiền tác giả nhận được sau khi trừ phí 5%
    const feePercentage = 0.05;
    const receivedAmount = amount * (1 - feePercentage);

    // Lấy ví người gửi và nhận
    const fromWallet = await Wallet.findOne({ user: userId });
    // Cập nhật ví người nhận (tác giả) với số tiền đã trừ phí
    const toWallet = await Wallet.findOneAndUpdate(
      { user: recipe.author },
      { $inc: { balance: receivedAmount } }, // Cộng số tiền đã trừ phí vào ví tác giả
      { new: true, upsert: true }
    );

    if (!fromWallet || fromWallet.balance < amount)
      return res.status(400).json({ message: "Số dư không đủ" });

    // Trừ tiền từ ví người gửi (số tiền đầy đủ)
    fromWallet.balance -= amount;
    await fromWallet.save();

    // Lưu transaction (với số tiền đầy đủ đã gửi)
    await Transaction.create({
      from: userId,
      to: recipe.author,
      amount: amount, // Lưu số tiền đầy đủ đã donate
      type: "donate",
      message,
      recipe: recipeId,
    });

    // Lấy tên tác giả và tên món ăn
    let authorName = "";
    let recipeTitle = "";
    try {
      // Populate author nếu cần
      if (
        recipe.author &&
        typeof recipe.author === "object" &&
        recipe.author.name
      ) {
        authorName =
          recipe.author.name ||
          recipe.author.fullName ||
          recipe.author.username ||
          "tác giả";
      } else {
        const author = await require("../models/User").findById(recipe.author); // Sử dụng user._id để tìm user
        authorName =
          author?.name || author?.fullName || author?.username || "tác giả";
      }
      recipeTitle = recipe.title || "món ăn";
    } catch {
      recipeTitle = recipe.title || "món ăn";
      authorName = "tác giả";
    }

    // Gửi thông báo cho người donate (với số tiền đầy đủ đã gửi)
    await notificationController.createNotification(
      userId,
      "donate",
      `Bạn đã donate ${amount.toLocaleString(
        "vi-VN"
      )}đ cho ${authorName} với công thức "${recipeTitle}".`,
      { amount, recipeId, to: recipe.author, recipeTitle, authorName }
    );

    // Gửi thông báo cho tác giả nhận donate (với số tiền đã trừ phí)
    // Lấy tên người gửi
    let senderName = "";
    try {
      const sender = await require("../models/User").findById(userId); // Sử dụng user_id
      senderName =
        sender?.name || sender?.fullName || sender?.username || "người dùng";
    } catch {
      senderName = "người dùng";
    }
    await notificationController.createNotification(
      recipe.author,
      "receive",
      `Bạn nhận được ${receivedAmount.toLocaleString(
        "vi-VN"
      )}đ donate từ ${senderName} cho công thức "${recipeTitle}".`,
      {
        amount: receivedAmount,
        recipeId,
        from: userId,
        recipeTitle,
        senderName,
      } // Lưu số tiền nhận được vào data
    );

    res.json({ message: "Donate thành công!" });
  } catch (err) {
    console.error("Lỗi donate:", err);
    res.status(500).json({ message: "Lỗi donate", error: err.message });
  }
};

// API donate cho tác giả blog
exports.donateToBlogAuthor = async (req, res) => {
  try {
    const { authorId, amount, message } = req.body; // Expect authorId instead of recipeId
    if (!authorId || !amount || amount < 1000)
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    const userId = req.user.user_id;

    // Lấy tác giả blog
    const author = await require("../models/User").findById(authorId);
    if (!author)
      return res.status(404).json({ message: "Không tìm thấy tác giả" });
    if (authorId.toString() === userId)
      return res
        .status(400)
        .json({ message: "Không thể donate cho chính mình" });

    // Tính toán số tiền tác giả nhận được sau khi trừ phí 5%
    const feePercentage = 0.05;
    const receivedAmount = amount * (1 - feePercentage);

    // Lấy ví người gửi và nhận
    const fromWallet = await Wallet.findOne({ user: userId });
    // Cập nhật ví người nhận (tác giả) với số tiền đã trừ phí
    const toWallet = await Wallet.findOneAndUpdate(
      { user: authorId }, // Use authorId
      { $inc: { balance: receivedAmount } }, // Cộng số tiền đã trừ phí vào ví tác giả
      { new: true, upsert: true }
    );

    if (!fromWallet || fromWallet.balance < amount)
      return res.status(400).json({ message: "Số dư không đủ" });

    // Trừ tiền từ ví người gửi (số tiền đầy đủ)
    fromWallet.balance -= amount;
    await fromWallet.save();

    // Lưu transaction (với số tiền đầy đủ đã gửi)
    await Transaction.create({
      from: userId,
      to: authorId, // Save authorId
      status: "success",
      amount: amount, // Lưu số tiền đầy đủ đã donate
      type: "donate-blog", // New type for blog donations
      method: "donate",
      message,
      // recipe: recipeId // Remove recipeId field
    });

    // Lấy tên tác giả
    let authorName =
      author?.name || author?.fullName || author?.username || "tác giả";

    // Gửi thông báo cho người donate (với số tiền đầy đủ đã gửi)
    await notificationController.createNotification(
      userId,
      "donate",
      `Bạn đã donate ${amount.toLocaleString(
        "vi-VN"
      )}đ cho ${authorName} cho bài viết.`,
      { amount, to: authorId, authorName } // Update data
    );

    // Gửi thông báo cho tác giả nhận donate (với số tiền đã trừ phí)
    // Lấy tên người gửi
    let senderName = "";
    try {
      const sender = await require("../models/User").findById(userId);
      senderName =
        sender?.name || sender?.fullName || sender?.username || "người dùng";
    } catch {
      senderName = "người dùng";
    }

    await notificationController.createNotification(
      authorId, // Notify the author
      "receive-blog-donate", // New notification type
      `Bạn nhận được ${receivedAmount.toLocaleString(
        "vi-VN"
      )}đ donate từ ${senderName} cho bài viết.`,
      { amount: receivedAmount, from: userId, senderName } // Update data
    );

    res.json({ message: "Donate thành công!" });
  } catch (err) {
    console.error("Lỗi donate blog:", err);
    res.status(500).json({ message: "Lỗi donate blog", error: err.message });
  }
};

// API request withdrawal (User)
exports.requestWithdrawal = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { amount, bankName, accountNumber, accountHolderName } = req.body;

    // Basic validation
    if (
      !amount ||
      amount <= 0 ||
      !bankName ||
      !accountNumber ||
      !accountHolderName
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đủ thông tin rút tiền hợp lệ." });
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ message: "Số tiền rút không hợp lệ." });
    }

    // Check user's wallet balance
    const userWallet = await Wallet.findOne({ user: userId });
    if (!userWallet || userWallet.balance < amountNumber) {
      return res.status(400).json({ message: "Số dư ví không đủ." });
    }

    // Deduct amount from wallet immediately and create a pending transaction
    userWallet.balance -= amountNumber;
    await userWallet.save();

    const withdrawalTransaction = await Transaction.create({
      from: userId,
      to: null, // Withdrawal goes out of the system
      amount: amountNumber,
      type: "withdraw-request",
      method: "bank transfer", // Assuming bank transfer for now
      status: "pending",
      bankName,
      accountNumber,
      accountHolderName,
    });

    // Notify admin(s) about the new withdrawal request (assuming admin notification logic exists)
    // This would likely involve finding admin users and creating notifications for them
    // For now, we'll just log a message or create a placeholder notification.
    console.log(
      `New withdrawal request from user ${userId} for amount ${amountNumber}`
    );
    // Example placeholder notification for admin (you'll need to implement finding admins):
    // const admins = await User.find({ role: 'admin' });
    // for (const admin of admins) {
    //   await notificationController.createNotification(
    //     admin._id,
    //     'withdrawal-requested',
    //     `Có yêu cầu rút tiền mới từ ${req.user.username || 'một người dùng'} số tiền ${amountNumber.toLocaleString('vi-VN')}đ.`, // Customize content
    //     { transactionId: withdrawalTransaction._id, userId: userId, amount: amountNumber }
    //   );
    // }

    res.status(201).json({
      message: "Yêu cầu rút tiền đã được gửi thành công và đang chờ duyệt.",
      transaction: withdrawalTransaction,
    });
  } catch (err) {
    console.error("Error requesting withdrawal:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi gửi yêu cầu rút tiền.", error: err.message });
  }
};

// API get withdrawal requests (Admin only)
exports.getWithdrawalRequests = async (req, res) => {
  try {
    // Ensure user is an admin (implement admin check middleware or in controller)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    const { status } = req.query; // Allow filtering by status
    const filter = { type: "withdraw-request" };
    if (status) {
      filter.status = status;
    }

    const withdrawals = await Transaction.find(filter)
      .populate("from", "username fullName")
      .sort({ createdAt: -1 }); // Populate user info

    res.json(withdrawals);
  } catch (err) {
    console.error("Error fetching withdrawal requests:", err);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách yêu cầu rút tiền.",
      error: err.message,
    });
  }
};

// API update withdrawal status (Admin only)
exports.updateWithdrawalStatus = async (req, res) => {
  try {
    // Ensure user is an admin (implement admin check middleware or in controller)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    const { id } = req.params; // Transaction ID
    const { status } = req.body; // New status (approved, rejected, completed)

    // Validate new status
    const validStatuses = ["approved", "rejected", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Trạng thái cập nhật không hợp lệ." });
    }

    const withdrawalTransaction = await Transaction.findOne({
      _id: id,
      type: "withdraw-request",
    });

    if (!withdrawalTransaction) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy yêu cầu rút tiền." });
    }

    // Prevent updating if already completed or rejected (optional, depends on workflow)
    if (
      withdrawalTransaction.status === "completed" ||
      withdrawalTransaction.status === "rejected"
    ) {
      return res.status(400).json({
        message: `Yêu cầu đã ở trạng thái \'${withdrawalTransaction.status}\'. Không thể cập nhật.`,
      });
    }

    // Update status
    withdrawalTransaction.status = status;

    // Handle rejected case: return amount to user's wallet
    if (status === "rejected") {
      const userWallet = await Wallet.findOne({
        user: withdrawalTransaction.from,
      });
      if (userWallet) {
        userWallet.balance += withdrawalTransaction.amount;
        await userWallet.save();
        // Send notification to user about rejection
        await notificationController.createNotification(
          withdrawalTransaction.from,
          "withdrawal-status-update",
          `Yêu cầu rút tiền ${withdrawalTransaction.amount.toLocaleString(
            "vi-VN"
          )}đ của bạn đã bị từ chối. Số tiền đã được hoàn lại ví.`, // Customize content
          {
            transactionId: withdrawalTransaction._id,
            status: status,
            amount: withdrawalTransaction.amount,
          }
        );
      }
    }
    // Handle approved/completed case: Send notification to user
    if (status === "approved" || status === "completed") {
      await notificationController.createNotification(
        withdrawalTransaction.from,
        "withdrawal-status-update",
        `Yêu cầu rút tiền ${withdrawalTransaction.amount.toLocaleString(
          "vi-VN"
        )}đ của bạn đã được ${status === "approved" ? "duyệt" : "hoàn thành"}.`, // Customize content
        {
          transactionId: withdrawalTransaction._id,
          status: status,
          amount: withdrawalTransaction.amount,
        }
      );
    }

    await withdrawalTransaction.save();

    res.json({
      message: `Cập nhật trạng thái yêu cầu rút tiền thành công: ${status}`,
      transaction: withdrawalTransaction,
    });
  } catch (err) {
    console.error("Error updating withdrawal status:", err);
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái yêu cầu rút tiền.",
      error: err.message,
    });
  }
};

// Handle Stripe webhooks
exports.handleStripeWebhook = async (req, res) => {
  console.log("[Stripe Webhook] Webhook handler received a request.");
  console.log(
    "[Stripe Webhook] Endpoint Secret (partial): ",
    endpointSecret ? endpointSecret.substring(0, 8) + "..." : "Not set"
  );
  const sig = req.headers["stripe-signature"];

  // Access raw body directly from req.body due to express.raw() middleware
  const rawBody = req.body;
  console.log("[Stripe Webhook] Accessed raw body from req.body.");

  try {
    let event;

    try {
      // Verify webhook signature using the raw body from req.body
      console.log(
        "[Stripe Webhook] Attempting to construct event from raw body and signature."
      );
      // console.log('[Stripe Webhook] Raw Body (partial): ', rawBody.toString().substring(0, 100) + '...'); // Log partial raw body (corrected)
      console.log("[Stripe Webhook] Signature: ", sig); // Log the signature
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret, {
        apiVersion: "2024-06-20",
      });
      console.log(
        `[Stripe Webhook] Event constructed successfully. Type: ${event.type}`
      );
    } catch (err) {
      // On error, return the error message
      console.error(
        `[Stripe Webhook] Webhook signature verification failed: ${err.message}`
      );
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!", paymentIntent);
        // Implement logic here to fulfill the purchase/update database
        // You can access paymentIntent.metadata to get associated data like userId, etc.
        // Example: Update wallet, create transaction
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log("PaymentMethod was attached to a Customer!", paymentMethod);
        // Handle this event
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Unhandled error in webhook handler:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Helper function to handle payment_intent.succeeded event
// This is similar to your existing confirmStripeTopup logic but triggered by webhook
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    console.log(
      `[Stripe Webhook] handlePaymentIntentSucceeded started for PaymentIntent ID: ${paymentIntent.id}`
    );
    const userId = paymentIntent.metadata.userId;
    const amount = paymentIntent.amount; // Amount is in smallest currency unit (e.g., cents for USD, dong for VND)
    const paymentIntentId = paymentIntent.id;

    console.log(
      `[Stripe Webhook] Processing PaymentIntent ID: ${paymentIntentId}, User ID: ${userId}, Amount: ${amount}`
    );

    // Find or create wallet
    console.log(`[Stripe Webhook] Looking for wallet for user ID: ${userId}`);
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      console.log(
        `[Stripe Webhook] Wallet not found for user ID: ${userId}. Creating new wallet.`
      );
      wallet = await Wallet.create({ user: userId });
      console.log(
        `[Stripe Webhook] New wallet created for user ID: ${userId}.`
      );
    } else {
      console.log(
        `[Stripe Webhook] Existing wallet found for user ID: ${userId}. Current balance: ${wallet.balance}`
      );
    }

    // Check if this transaction has already been processed to prevent duplicates
    console.log(
      `[Stripe Webhook] Checking for existing transaction with PaymentIntent ID: ${paymentIntentId}`
    );
    const existingTransaction = await Transaction.findOne({
      method: "stripe",
      status: "success",
      "metadata.paymentIntentId": paymentIntentId,
    });
    if (existingTransaction) {
      console.log(
        `[Stripe Webhook] Transaction for PaymentIntent ID ${paymentIntentId} already processed. Aborting.`
      );
      return; // Already processed, do nothing
    }
    console.log(
      `[Stripe Webhook] No existing transaction found for PaymentIntent ID: ${paymentIntentId}. Proceeding.`
    );

    // Update wallet balance
    console.log(
      `[Stripe Webhook] Updating wallet balance. Current balance: ${wallet.balance}, Amount to add: ${amount}`
    );
    wallet.balance += amount; // Amount from Stripe is usually in the smallest unit
    wallet.updatedAt = new Date();
    await wallet.save();
    console.log(
      `[Stripe Webhook] Wallet balance updated successfully. New balance: ${wallet.balance}`
    );

    // Create transaction record
    console.log(
      `[Stripe Webhook] Creating transaction record for PaymentIntent ID: ${paymentIntentId}`
    );
    await Transaction.create({
      from: null,
      to: userId,
      amount: amount, // Store amount in smallest unit or convert if necessary
      type: "topup", // Assuming this is for topup, adjust if other types of payments use this webhook
      method: "stripe",
      status: "success",
      metadata: { paymentIntentId: paymentIntentId }, // Store Stripe Payment Intent ID
    });
    console.log(
      `[Stripe Webhook] Transaction record created successfully for PaymentIntent ID: ${paymentIntentId}`
    );

    // Gửi thông báo nạp tiền
    console.log(
      `[Stripe Webhook] Sending topup notification to user ID: ${userId}`
    );
    await notificationController.createNotification(
      userId,
      "topup",
      `Bạn đã nạp ${amount.toLocaleString("vi-VN")}đ vào tài khoản thành công!`, // Adjust currency display if needed
      { amount }
    );
    console.log(
      `[Stripe Webhook] Topup notification sent to user ID: ${userId}`
    );

    console.log(
      `[Stripe Webhook] Wallet updated and Transaction created for PaymentIntent ID ${paymentIntentId}`
    );
  } catch (err) {
    console.error(
      `[Stripe Webhook] Error handling payment_intent.succeeded for PaymentIntent ID ${paymentIntent?.id}:`,
      err
    );
    // Consider logging this error or using a monitoring system
  }
};
