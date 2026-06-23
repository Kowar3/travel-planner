package com.projekat;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import static org.testng.Assert.*;

public class LoginTest extends BaseTest {

    LoginPage loginPage;

    @BeforeMethod
    public void preSvakogTesta()
    {
        loginPage = new LoginPage(driver);
    }

    @Test
    public void uspesanLogin(){

        loginPage.setUsername("pera@gmail.com");
        loginPage.setPassword("PFKbgd123*");

        CreateTripPage createPage = loginPage.submitLogin();

        assertNotNull(createPage);
        assertTrue(loginPage.getUrl().contains("dashboard"));
    }

    @Test
    public void neuspesanLogin(){

        loginPage.setUsername("pogresan_user@gmail.com");
        loginPage.setPassword("pogresna_sifra");

        String tekstGreske = loginPage.submitLoginWithError();

        assertFalse(tekstGreske.isEmpty());
        assertTrue(tekstGreske.contains("Invalid email!"));
    }
}