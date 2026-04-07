@api
Feature: DummyJSON Authentication API
  As an API consumer
  I want to authenticate using the DummyJSON auth endpoints
  So that I can access protected resources

  @smoke
  Scenario: Successful login with valid credentials
    When I send a POST request to login with username "emilys" and password "emilyspass"
    Then the response status should be 200
    And the response should contain an access token
    And the response should contain user details

  Scenario: Login with invalid credentials
    When I send a POST request to login with username "wronguser" and password "wrongpass"
    Then the response status should be 400

  Scenario: Access protected endpoint with valid token
    Given I have logged in successfully with valid credentials
    When I request my profile using the auth token
    Then the response status should be 200
    And the response should contain my user information

  Scenario: Refresh authentication token
    Given I have logged in successfully with valid credentials
    When I refresh the authentication token
    Then the response status should be 200
    And the response should contain a new access token
