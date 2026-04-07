@ui @smoke
Feature: Login Functionality
  As a user of SauceDemo
  I want to be able to login with valid credentials
  So that I can access the inventory page

  Background:
    Given I am on the login page

  @positive
  Scenario: Successful login with valid credentials
    When I enter username "standard_user" and password "secret_sauce"
    And I click the login button
    Then I should be redirected to the inventory page
    And the page title should be "Products"

  @positive
  Scenario Outline: Login with multiple valid user types
    When I enter username "<username>" and password "<password>"
    And I click the login button
    Then I should be redirected to the inventory page

    Examples:
      | username        | password     |
      | standard_user   | secret_sauce |
      | problem_user    | secret_sauce |
      | visual_user     | secret_sauce |

  @negative
  Scenario: Login with invalid credentials
    When I enter username "invalid_user" and password "wrong_password"
    And I click the login button
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"

  @negative
  Scenario: Login with empty username
    When I enter username "" and password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Username is required"

  @negative
  Scenario: Login with locked out user
    When I enter username "locked_out_user" and password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Sorry, this user has been locked out."
