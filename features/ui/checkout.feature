@ui
Feature: Checkout Process
  As a logged-in user
  I want to complete the checkout process
  So that I can purchase my selected items

  Background:
    Given I am logged in as "standard_user"
    And I have added "Sauce Labs Backpack" to the cart
    And I navigate to the cart page

  @smoke
  Scenario: Complete full checkout successfully
    When I click on checkout
    And I fill in first name "John" last name "Doe" and postal code "12345"
    And I click continue on checkout step one
    Then I should see the order summary
    When I click finish
    Then I should see the order confirmation message "Thank you for your order!"

  Scenario: Checkout with missing first name
    When I click on checkout
    And I fill in first name "" last name "Doe" and postal code "12345"
    And I click continue on checkout step one
    Then I should see a checkout error "Error: First Name is required"

  Scenario: Checkout with missing last name
    When I click on checkout
    And I fill in first name "John" last name "" and postal code "12345"
    And I click continue on checkout step one
    Then I should see a checkout error "Error: Last Name is required"

  Scenario: Checkout with missing postal code
    When I click on checkout
    And I fill in first name "John" last name "Doe" and postal code ""
    And I click continue on checkout step one
    Then I should see a checkout error "Error: Postal Code is required"

  Scenario: Verify order summary details before finishing
    When I click on checkout
    And I fill in first name "Jane" last name "Smith" and postal code "90210"
    And I click continue on checkout step one
    Then I should see the order summary
    And the order total should be displayed

  Scenario: Cancel checkout and return to cart
    When I click on checkout
    And I click cancel on checkout
    Then I should be on the cart page
