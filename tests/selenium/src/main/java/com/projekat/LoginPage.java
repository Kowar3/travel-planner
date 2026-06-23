package com.projekat;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage extends BasePage {

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    private By usernameBy = By.name("email");
    private By passwordBy = By.name("password");
    private By loginBtnBy = By.xpath("//button[contains(text(), 'Sign In')]");

    public void setUsername(String username) {
        driver.findElement(usernameBy).sendKeys(username);
    }

    public void setPassword(String password) {
        driver.findElement(passwordBy).sendKeys(password);
    }

    public void clickLogin()
    {
        driver.findElement(loginBtnBy).click();
    }

    public CreateTripPage submitLogin(){

        clickLogin();

        wait.until(ExpectedConditions.urlContains("dashboard"));

        return new CreateTripPage(driver);
    }


    public String submitLoginWithError(){

        clickLogin();

        return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[text()='Invalid email!']")
        )).getText();
    }

}