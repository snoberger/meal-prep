import { Accordion, AccordionDetails, AccordionSummary, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import Ingredient from './Ingedrient/Ingredient';
import "./Recipe.css";
import { IngredientType, RecipeType, StepType } from './types';

const makeIngredient = (ingredient: IngredientType) => {
    return(
        <React.Fragment key={ingredient.id}>
                <Accordion style={{ backgroundColor: "#ffff", margin: ' 10px 30px 0px 30px' }}>
                    <AccordionSummary>
                        <Typography variant="h5">{ingredient.name}</Typography> 
                    </AccordionSummary>    
                    <Divider />                
                    <Ingredient ingredientData={ingredient} />
                </Accordion>
            </React.Fragment>
    );
};
const setupViewIngredient = (ingredients: IngredientType[]) => {
    return <div style={{flexDirection: 'column'}}>{ingredients.map((ingredient) => {
        return makeIngredient(ingredient);
    })}</div>;
};

const makeStep = (step: StepType) => {
    return(
        <React.Fragment key={step}>
            <Typography variant="h5">{step}</Typography>
        </React.Fragment>
    );
};
const setupViewSteps = (steps: StepType[]) => {
    return <div style={{flexDirection: 'row'}}>{steps.map((step) => {
        return makeStep(step);
    })}</div>;
};
export default class Recipe extends React.Component<{
    recipeData: RecipeType
}, {}> {
    render() {
        return(
            <AccordionDetails>
            <Grid container justify="center" alignItems="center">
                <Grid>
                        <Grid item>
                        <div>
                                <Typography variant="h5" className="recipe-ingredients-title">
                                    Ingredients:
                                    {setupViewIngredient(this.props.recipeData.ingredients)} 
                                </Typography>
                                <Typography variant="h5" className="recipe-instructions-title">
                                    Instructions:  
                                    {setupViewSteps(this.props.recipeData.steps)}
                                </Typography>        
                            </div>
                        </Grid>
                </Grid>
            </Grid>
          </AccordionDetails>
        );
    }
}
