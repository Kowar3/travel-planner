package com.projekat;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class CreateTripPage extends BasePage {

    public CreateTripPage(WebDriver driver) {
        super(driver);
    }

    private By titleInput = By.xpath("//input[@placeholder='e. g. Kragujevac - Beč']");
    private By fromBox = By.xpath("//*[text()='FROM (GREEN)']");
    private By toBox = By.xpath("//*[text()='TO (RED)']");
    private By mapSearchInput = By.xpath("//input[@placeholder='Find city...']");
    private By firstResult = By.xpath("//p[contains(text(), ',')]/..");

    private By departureInput = By.xpath("//label[text()='DEPARTURE']/../input");
    private By returnInput = By.xpath("//label[text()='RETURN']/../input");
    private By budgetInput = By.xpath("//input[@type='number']");
    private By addTripBtn = By.xpath("//button[text()='ADD TRIP']");

    public void unesiNaslov(String naslov) {
       driver.findElement(titleInput).sendKeys(naslov);
    }

    public void odaberiLokaciju(By box, String grad){

        driver.findElement(box).click();

        WebElement search = wait.until(ExpectedConditions.visibilityOfElementLocated(mapSearchInput));
        search.clear();
        search.sendKeys(grad);

        WebElement result = wait.until(ExpectedConditions.elementToBeClickable(firstResult));

        result.click();
    }

    public void odaberiPolaziste(String grad){
        odaberiLokaciju(fromBox, grad);
    }

    public void odaberiOdrediste(String grad){
        odaberiLokaciju(toBox, grad);
    }

    public void popuniDatum(By locator, String dan, String mesec, String godina) {
        WebElement el = driver.findElement(locator);
        el.click();
        el.sendKeys(dan);
        el.sendKeys(mesec);
        el.sendKeys(godina);
    }

    public void unesiDatumPolaska(String dan, String mesec, String godina) {
        popuniDatum(departureInput, dan, mesec, godina);
    }

    public void unesiDatumPovratka(String dan, String mesec, String godina) {
        popuniDatum(returnInput, dan, mesec, godina);
    }

    public void unesiBudzet(String iznos) {
        WebElement el = driver.findElement(budgetInput);
        el.clear();
        el.sendKeys(iznos);
    }

    public void klikniAddTrip() {
        driver.findElement(addTripBtn).click();
    }

    public boolean jeIStranicaZaKreiranje() {
        return driver.getCurrentUrl().endsWith("/trips/new");
    }

    public String tekstGreske() {
        try {
            WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//div[contains(@class, 'Toastify')]")
            ));
            return toast.getText();
        } catch (Exception e) {
            return "Greška!";
        }
    }
}