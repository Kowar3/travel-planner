package com.projekat;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class CreateTripTest extends BaseTest{

    LoginPage loginPage;

    @BeforeMethod
    public void preSvakogTesta(){

        loginPage = new LoginPage(driver);
        loginPage.setUsername("pera@gmail.com");
        loginPage.setPassword("PFKbgd123*");
        loginPage.submitLogin();
    }

    @Test
    public void testUspesnoKreiranjeTripa() throws InterruptedException {

        driver.get("http://localhost:5173/trips/new");
        CreateTripPage page = new CreateTripPage(driver);

        page.unesiNaslov("Moja tura");
        page.odaberiPolaziste("Kragujevac");
        page.odaberiOdrediste("Beograd");

        page.unesiDatumPolaska("20", "05", "2026");
        page.unesiDatumPovratka("30", "05", "2026");

        page.unesiBudzet("500");

        page.klikniAddTrip();

        Thread.sleep(1000);

        String trenutniUrl = driver.getCurrentUrl();
        assertTrue(trenutniUrl.contains("/trips/"));
        assertFalse(trenutniUrl.endsWith("/new"));
    }

    @Test
    public void testNeuspesnoKreiranjeBezOdredista() throws InterruptedException {

        driver.get("http://localhost:5173/trips/new");
        CreateTripPage page = new CreateTripPage(driver);

        page.unesiNaslov("Nepotpuni Trip");
        page.odaberiPolaziste("Kragujevac");

        page.unesiDatumPolaska("20", "05", "2026");
        page.unesiDatumPovratka("30", "05", "2026");
        page.unesiBudzet("1000");

        page.klikniAddTrip();

        Thread.sleep(2000);

        assertTrue(page.jeIStranicaZaKreiranje());
        assertEquals(page.tekstGreske(), "Choose end point!");
    }
}