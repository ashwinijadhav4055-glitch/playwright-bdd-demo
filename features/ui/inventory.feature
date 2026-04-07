@ui
Feature: Inventory / Product Listing
  As a logged-in user
  I want to browse and interact with the product list
  So that I can add items to my cart

  Background:
    Given I am logged in as "standard_user"

  @smoke
  Scenario: Products are displayed on the inventory page
    Then I should see at least 1 product on the page
    And the page title should be "Products"

  Scenario: Add a single product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  Scenario: Add multiple products to cart
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2"

  Scenario: Remove a product from cart via inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I remove "Sauce Labs Backpack" from the cart on the inventory page
    Then the cart badge should not be visible

  Scenario: Sort products by price low to high
    When I sort products by "lohi"
    Then the products should be sorted by price ascending

  Scenario: Sort products by name Z to A
    When I sort products by "za"
    Then the products should be sorted by name descending

  Scenario: Navigate to cart page
    When I add "Sauce Labs Backpack" to the cart
    And I click on the shopping cart
    Then I should be on the cart page
