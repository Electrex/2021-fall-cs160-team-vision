/// <reference types="cypress" />

// Chance generates random strings that will be useful for inputing test data
import Chance from 'chance'
const chance = new Chance()

describe('agora', () =>{
    // starting each test at the landing page since baseUrl in cypress.json = http://localhost:3000

    // randomize dummy data for every time this set of tests is run
    // otherwise, this would be registering the same user over and over again 
    const dummy = {
        name: 'test-' + chance.word(),
        email: chance.email(),
        password: chance.word({length: 6}),
        link: chance.url(),
        desc: 'This is a test',
        title: 'Test'
    }

    //register feature test
    it('Signing up a new user', () => {
        // go to sign up page on /signup
        cy.visit('/signup')
        cy.url().should('include','signup')
        // assert there is a form on the page
        cy.get('form').children().each(($element,index1, $list) => {
            cy.wrap($element).children().each(($child, index2, $list) => {
                if (index1 < 4){ // form field case
                    if(index2 === 0 ){ // label case
                        let controlLabels = ['Name','E-Mail Address','Password','Confirm Password']
                        cy.wrap($child).should('exist').and('be.visible').and('contain', controlLabels[index1])
                    } else { // input case
                        let type = 'password'
                        if (index1 === 0 ){
                            type = 'text'
                        } else if (index1 === 1){
                            type = 'email'
                        }
                        cy.wrap($child).should('be.empty').and('have.attr','type').and('eq',type)
                    }
                } else { // button case
                     cy.wrap($child).should('exist').and('be.visible')//assert that a submit button exists and is visible
                }
                
            })
        })
        //register dummy user
        cy.get('input[name=name]').type(dummy.name)
        cy.get('input[name=email]').type(dummy.email)
        cy.get('input[name=password]').type(dummy.password)
        cy.get('input[name=password2]').type(dummy.password)
        cy.get('button').click()

        // assert the page was redirected to /me
        cy.url().should('include','me')
    })  
    //login feature test
    it('Logging in a user', () => {
        // navigate to /signin by clicking the Signin button
        cy.visit('/signin')
        // verify you have reached /signin
        cy.url().should('include', 'signin')
        // assert there is a form and access the elements inside it
        cy.get('form').children().each(($formfield, formfield, $list) => {
            cy.wrap($formfield).children().each(($child, index, $list) => {
                if (formfield < 2){ // form input case
                    if (index === 0){ // label case
                        let label = formfield === 1 ? 'Password' : 'E-Mail Address'
                        cy.wrap($child).should('exist').and('be.visible').and('contain', label)
                    } else { // input case
                        let type = formfield === 1 ? 'password' : 'email'
                        cy.wrap($child).should('be.empty').and('have.attr','type').and('eq',type)
                    }
                } else{ // button case
                    cy.wrap($child).should('exist').and('be.visible') //assert that a submit button exists and is visible
                }
            })
        })

        //log in the dummy user
        cy.get('input[name=email').type(dummy.email)
        cy.get('input[name=password]').type(dummy.password)
        cy.get('button').click()

        //verify the redirect to /me
        cy.url().should('include','me')
    })
    //create review feature test
    it('Creating a review', () => {
        cy.visit('/me/reviews/add')
        cy.url().should('include','/me/reviews/add')
        cy.get('label').each(($label, labelnum, $list) => {
            let labels = ['Add a link to the product you are reviewing:','What is the title of your review?','Enter your review here:','Add image URL here:']
            cy.wrap($label).should('exist').and('be.visible').and('contain',labels[labelnum])
        })
        cy.get('input').each(($input, inputnum, $list) => {
            let type = inputnum === 0 || inputnum === 2 ? 'url' : 'text'
            if(inputnum < 3){ // input case
                cy.wrap($input).should('exist').and('be.visible').and('have.attr','type').and('eq',type)
            }
        })
        cy.get('input[name=link]').type(dummy.link)
        cy.get('input[name=title]').type(dummy.title)
        cy.get('textarea').type(dummy.desc)
        cy.get('input[name=image]').type(dummy.link)
        cy.get('input[value=Submit]').click()
        cy.url().should('include','/me/reviews')
    })
})