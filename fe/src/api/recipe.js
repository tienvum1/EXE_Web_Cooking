import axios from "axios";

const API_URL = "https://exe-web-cooking.onrender.com";
export const fetchRecipePendingById = async (id) => {
  const res = await axios.get(`${API_URL}/api/recipes/pendings/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
export const fetchRecipeById = async (id) => {
  const res = await axios.get(`${API_URL}/api/recipes/pendings/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
export const fetchRecipeApproveById = async (id) => {
  const res = await axios.get(`${API_URL}/api/recipes/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
export const fetchNewestRecipes = async () => {
  const res = await axios.get(`${API_URL}/api/recipes/newest`, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchMostLikedRecipes = async () => {
  const res = await axios.get(`${API_URL}/api/recipes/most-liked`, {
    withCredentials: true,
  });
  return res.data;
};

// Function to fetch recipes pending approval (requires admin)
export const fetchPendingRecipes = async () => {
  // Assuming auth token is handled by axios interceptor or similar, or sent via cookie
  const res = await axios.get(`${API_URL}/api/recipes/pendings`, {
    withCredentials: true,
  });
  return res.data;
};

// Function to update a recipe's status (requires admin)
export const updateRecipeStatus = async (id, status) => {
  // Assuming auth token is handled by axios interceptor or similar, or sent via cookie
  const res = await axios.put(
    `${API_URL}/api/recipes/${id}/status`,
    { status },
    { withCredentials: true }
  );
  return res.data;
};

// Function to get AI menu suggestion based on prompt
export const getAIMenuSuggestion = async (prompt) => {
  try {
    // Make a POST request to the backend AI endpoint
    // The backend will process the prompt and return recipe suggestions
    const response = await axios.post(
      `${API_URL}/api/ai/menu-suggestion`,
      { prompt },
      {
        withCredentials: true, // Send credentials if the AI endpoint requires authentication
      }
    );
    return response.data; // Assuming backend returns the menu suggestion data
  } catch (error) {
    console.error("Error fetching AI menu suggestion:", error);
    throw error; // Re-throw to be handled by the calling component
  }
};

// Function to delete a recipe (requires author or admin)
export const deleteRecipe = async (id) => {
  const res = await axios.delete(`${API_URL}/api/recipes/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

// Like/Unlike a recipe
export const toggleLike = async (recipeId) => {
  const res = await axios.post(
    `${API_URL}/api/recipes/like`,
    { recipeId },
    { withCredentials: true }
  );
  return res.data;
};

// Check if user has liked a recipe
export const checkLikeStatus = async (recipeId) => {
  const res = await axios.get(
    `${API_URL}/api/recipes/like-status/${recipeId}`,
    { withCredentials: true }
  );
  return res.data;
};
