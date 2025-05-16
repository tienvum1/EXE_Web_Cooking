import React from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import RecipeHeader from './RecipeHeader';
import NutritionInfo from './NutritionInfo';
import ImageSection from './ImageSection';
import IngredientsList from './IngredientsList';
import DirectionsList from './DirectionsList';
import video from '../../assets/images/video.mp4';
import RecommendedRecipes from './RecommendedRecipes';
import Sidebar from '../../components/sidebar/Sidebar';
import RecipeComments from './RecipeComments';
import RecipeAuthorInfo from './RecipeAuthorInfo';
import logo from '../../assets/images/logo.png';
import './DetailRecipe.scss';


const DetailRecipe = () => {
  const recipeData = {
    title: 'Seared Beef Salad',
    user: { name: 'John Smith', date: '15 January 2025', avatar: '/avatar.jpg' },
    prepTime: '15 Minutes',
    cookTime: '15 Minutes',
    servings: 4,
    nutrition: {
      calories: '219.9 kcal',
      fat: '10.7 g',
      protein: '7.9 g',
      carbs: '22.3 g',
    },
    description:
      'Enjoy a hearty and refreshing Seared Beef Niçoise Salad, featuring perfectly seared beef slices served over a bed of fresh greens, cherry tomatoes, olives, potatoes, and green beans, all drizzled with a tangy dressing. This protein-packed salad combines rich, savory flavors with crisp textures, making it a delicious and satisfying meal!',
    ingredients: {
      mainDish: ['Boiled eggs', 'Seared beef', 'Fresh lettuce', 'Cherry tomatoes', 'Boiled potatoes'],
      sauce: ['3 tbsp olive oil', '1 tbsp red wine vinegar or lemon juice', '1 tsp Dijon mustard'],
    },
    directions: [
      {
        title: 'Prepare the Beef',
        description:
          'Begin by seasoning the steak generously with salt and black pepper on both sides. This enhances the flavor and ensures a well-balanced taste. Next, heat a tablespoon of olive oil in a pan over medium-high heat until it starts to shimmer. Carefully place the steak in the pan and sear it for about 2-3 minutes per side if you prefer it medium-rare. Once done, remove the steak from the pan and let it rest on a cutting board for 5 minutes before slicing thinly against the grain.',
        images: [
          logo
        ]
      },
      {
        title: 'Boil the Eggs and Potatoes',
        description:
          'Place 4 eggs in a saucepan and cover with cold water. Bring to a boil over medium-high heat, then reduce to a simmer and cook for 8 minutes for a slightly soft center. Transfer the eggs to an ice bath to cool, then peel and cut into halves. In another pot, boil the potatoes in salted water for 10-12 minutes or until fork-tender. Drain and set aside to cool slightly, then cut into bite-sized pieces.',
        images: [
          logo
        ]
      },
      {
        title: 'Blanch the Green Beans',
        description:
          'Bring a pot of salted water to a boil. Add the green beans and cook for 2-3 minutes until bright green and crisp-tender. Immediately transfer the green beans to an ice bath to stop the cooking process and preserve their vibrant color. Drain well and pat dry with a paper towel.',
        images: [
          logo
        ]
      },
      {
        title: 'Make the Dressing',
        description:
          'In a small bowl, whisk together 3 tablespoons of olive oil, 1 tablespoon of red wine vinegar (or lemon juice), 1 teaspoon of Dijon mustard, a pinch of salt, and a pinch of black pepper until well combined. Taste and adjust seasoning if needed. Set aside to let the flavors meld.',
        images: [
         logo
        ]
      },
      {
        title: 'Assemble the Salad',
        description:
          'On a large serving platter, arrange a bed of fresh lettuce leaves. Scatter the cherry tomatoes (halved), boiled potatoes, green beans, and olives evenly over the lettuce. Place the halved boiled eggs around the edges of the platter. Arrange the thinly sliced seared beef on top of the salad. Drizzle the dressing over the entire salad, ensuring even coverage. Garnish with a sprinkle of fresh herbs, such as parsley or basil, if desired, and serve immediately.',
        images: [
         logo, logo, logo
        ]
      },
    ],
  };

  return (
    <> <Header />
     <Sidebar />
    <div className="detail-layout">
     
      <RecipeHeader
        title={recipeData.title}
        user={recipeData.user}
        prepTime={recipeData.prepTime}
        cookTime={recipeData.cookTime}
        servings={recipeData.servings}
      />
      <div className="top-section">
        <div className="left-col">
          <ImageSection src={video} alt="Seared Beef Salad" />
        </div>
        <div className="right-col">
          <NutritionInfo
            calories={recipeData.nutrition.calories}
            fat={recipeData.nutrition.fat}
            protein={recipeData.nutrition.protein}
            carbs={recipeData.nutrition.carbs}
          />
        </div>
      </div>
      <p className="description">{recipeData.description}</p>
      <IngredientsList
        mainDish={recipeData.ingredients.mainDish}
        sauce={recipeData.ingredients.sauce}
      />
      <DirectionsList directions={recipeData.directions} />
     
    </div>
    <RecipeComments />
    <RecipeAuthorInfo />
    <RecommendedRecipes />
  
    <Footer />
    </>
  );
};

export default DetailRecipe;