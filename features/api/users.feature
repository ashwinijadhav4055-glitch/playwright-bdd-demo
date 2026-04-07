@api
Feature: DummyJSON Users API
  As an API consumer
  I want to manage users via the DummyJSON API
  So that I can perform CRUD operations on user data

  @smoke
  Scenario: Get all users
    When I send a GET request to retrieve all users
    Then the response status should be 200
    And the response should contain a list of users
    And the users response should include total count

  Scenario: Get a specific user by ID
    When I send a GET request for user with ID 1
    Then the response status should be 200
    And the response should contain user details with id 1

  Scenario: Search users by name
    When I search for users with keyword "John"
    Then the response status should be 200
    And the user search results should not be empty

  Scenario: Create a new user
    When I send a POST request to create a user with the following data:
      | firstName | lastName | email                  | age |
      | TestFirst | TestLast | testuser@example.com   | 28  |
    Then the response status should be 201
    And the response should contain the created user with firstName "TestFirst"

  Scenario: Update a user using PUT
    When I send a PUT request to update user with ID 1 with lastName "UpdatedLastName"
    Then the response status should be 200
    And the response should contain the updated lastName "UpdatedLastName"

  Scenario: Partially update a user using PATCH
    When I send a PATCH request to update user with ID 1 with age 35
    Then the response status should be 200
    And the response user age should be 35

  Scenario: Delete a user
    When I send a DELETE request for user with ID 1
    Then the response status should be 200
    And the response should confirm the user is deleted
