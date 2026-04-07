@api
Feature: DummyJSON Products API
  As an API consumer
  I want to manage products via the DummyJSON API
  So that I can perform CRUD operations on product data

  @smoke
  Scenario: Get all products
    When I send a GET request to retrieve all products
    Then the response status should be 200
    And the response should contain a list of products
    And the response should include total count

  Scenario: Get a specific product by ID
    When I send a GET request for product with ID 1
    Then the response status should be 200
    And the response should contain product details with id 1

  Scenario: Search products by keyword
    When I search for products with keyword "phone"
    Then the response status should be 200
    And the search results should contain relevant products

  Scenario: Get products by category
    When I get products in category "smartphones"
    Then the response status should be 200
    And all returned products should be in category "smartphones"

  Scenario: Create a new product
    When I send a POST request to create a product with the following data:
      | title       | description            | price | category    |
      | Test Laptop | A test laptop product  | 999   | electronics |
    Then the response status should be 201
    And the response should contain the created product with title "Test Laptop"

  Scenario: Update a product using PUT
    When I send a PUT request to update product with ID 1 with title "Updated Laptop Pro"
    Then the response status should be 200
    And the response should contain the updated title "Updated Laptop Pro"

  Scenario: Partially update a product using PATCH
    When I send a PATCH request to update product with ID 1 with price 1299
    Then the response status should be 200
    And the response product price should be 1299

  Scenario: Delete a product
    When I send a DELETE request for product with ID 1
    Then the response status should be 200
    And the response should confirm the product is deleted
