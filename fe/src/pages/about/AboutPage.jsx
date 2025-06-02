import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AboutPage.scss';
import teamImg from '../../assets/images/wellnessChef.png'; // Use your own team image if available

const AboutPage = () => (
  <>
    <Header />
    <div className="about-container">
      <h1 className="about-title">Về FitMeal</h1>
      <p className="about-desc">
        Chào mừng đến với <b>FitMeal</b> – người bạn đồng hành đáng tin cậy trên hành trình hướng tới cuộc sống khỏe mạnh hơn, hạnh phúc hơn và ngon miệng hơn! Chúng tôi tin rằng mỗi bữa ăn là một cơ hội để nuôi dưỡng cơ thể, kết nối với những người thân yêu và tận hưởng niềm vui nấu nướng.
      </p>

      <div className="about-section about-mission">
        <h2>Sứ mệnh của chúng tôi</h2>
        <p>
          Tại FitMeal, sứ mệnh của chúng tôi là truyền cảm hứng và trao quyền cho mọi người ở khắp mọi nơi để áp dụng thói quen ăn uống lành mạnh và khám phá niềm vui của những bữa ăn tại nhà. Chúng tôi nỗ lực làm cho việc nấu ăn bổ dưỡng trở nên dễ tiếp cận, thú vị và đáng giá cho tất cả mọi người – từ những người bận rộn đến các đầu bếp tại gia đam mê và các gia đình.
        </p>
        <p>
          Chúng tôi cam kết xây dựng một cộng đồng sôi động nơi các thành viên có thể chia sẻ công thức, trao đổi kinh nghiệm và hỗ trợ lẫn nhau tạo nên những thay đổi tích cực trong lối sống. Cùng nhau, chúng ta có thể tạo ra một thế giới nơi ăn uống lành mạnh không phải là thử thách, mà là một lối sống vui vẻ và bền vững.
        </p>
      </div>

      <div className="about-section about-values">
        <h2>Giá trị cốt lõi của chúng tôi</h2>
        <ul>
          <li>
            <b>Cộng đồng:</b> Chúng tôi tin vào sức mạnh của sự chia sẻ và học hỏi lẫn nhau. Mỗi công thức, mẹo vặt hay câu chuyện đều giúp chúng tôi cùng nhau phát triển mạnh mẽ hơn.
          </li>
          <li>
            <b>Sáng tạo:</b> Chúng tôi khuyến khích thử nghiệm trong nhà bếp và tôn vinh sự đa dạng của hương vị, văn hóa và truyền thống ẩm thực, làm cho mỗi bữa ăn trở nên độc đáo.
          </li>
          <li>
            <b>Sức khỏe:</b> Chúng tôi ưu tiên sức khỏe và sự cân bằng, thúc đẩy dinh dưỡng hợp lý và ăn uống tỉnh thức mà không hy sinh hương vị hay niềm vui.
          </li>
          <li>
            <b>Chính trực:</b> Chúng tôi tận tâm cung cấp nội dung đáng tin cậy, chất lượng cao và xây dựng một môi trường an toàn, tôn trọng và hòa nhập cho tất cả mọi người.
          </li>
        </ul>
      </div>

      <div className="about-section about-story">
        <h2>Câu chuyện của chúng tôi</h2>
        <p>
          FitMeal ra đời từ một ý tưởng đơn giản: ăn uống lành mạnh nên dễ dàng, vui vẻ và ai cũng có thể tiếp cận. Những người sáng lập của chúng tôi, một nhóm những người yêu ẩm thực và ủng hộ lối sống lành mạnh, nhận thấy sự cần thiết của một nền tảng không chỉ cung cấp những công thức ngon miệng mà còn hỗ trợ mọi người xây dựng những thói quen lành mạnh bền vững.
        </p>
        <p>
          Kể từ khi ra mắt, chúng tôi đã phát triển thành một cộng đồng thịnh vượng gồm những đầu bếp đam mê, chuyên gia dinh dưỡng và những người hùng đời thường, những người truyền cảm hứng cho chúng tôi mỗi ngày bằng sự sáng tạo và cam kết với sức khỏe. Chúng tôi tự hào được là một phần trong hành trình của bạn và biết ơn vì sự tin tưởng bạn đã dành cho chúng tôi.
        </p>
      </div>

      <div className="about-section about-team">
        <h2>Gặp gỡ đội ngũ FitMeal</h2>
        <div className="about-team-flex">
          <img src={teamImg} alt="Đội ngũ FitMeal" className="about-team-img" />
          <div>
            <p>
              Đội ngũ của chúng tôi được tạo thành từ những chuyên gia tận tâm với nền tảng trong lĩnh vực dinh dưỡng, nghệ thuật ẩm thực, công nghệ và xây dựng cộng đồng. Chúng tôi đoàn kết bởi niềm đam mê chung với ẩm thực, sức khỏe và mong muốn giúp đỡ người khác thành công.
            </p>
            <p>
              Mỗi ngày, chúng tôi làm việc để mang đến cho bạn những công thức mới, những bài viết hữu ích và những tính năng sáng tạo giúp việc nấu ăn lành mạnh trở nên dễ dàng và thú vị hơn. Chúng tôi luôn lắng nghe phản hồi của bạn và không ngừng tìm cách cải thiện và phát triển.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section about-join">
        <h2>Tham gia cùng chúng tôi trên hành trình</h2>
        <p>
          Dù bạn là một đầu bếp dày dạn kinh nghiệm hay chỉ mới bắt đầu, FitMeal luôn ở đây để hỗ trợ bạn từng bước trên con đường. Khám phá bộ sưu tập công thức phong phú của chúng tôi, kết nối với những người cùng đam mê ẩm thực và khám phá niềm vui của việc nấu ăn và thưởng thức những bữa ăn ngon miệng, bổ dưỡng.
        </p>
        <p>
          Cảm ơn bạn đã là một phần của gia đình FitMeal. Cùng nhau, hãy biến mỗi bữa ăn thành một lễ kỷ niệm của sức khỏe, hạnh phúc và cộng đồng!
        </p>
      </div>
    </div>
    <Footer />
  </>
);

export default AboutPage;