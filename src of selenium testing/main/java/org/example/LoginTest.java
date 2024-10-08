package org.example;
import java.time.Duration;

import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginTest {

    private static WebDriver driver;
    private static WebDriverWait wait;

    @BeforeClass
    public static void setupAll() {
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Prism Infotech\\Desktop\\Tests\\src\\main\\java\\org\\example\\chromedriver.exe");
        
        }

    @Before
    public void setup() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @After
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // Login


    @Test
    public void testSuccessfulAdminLogin() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button:nth-child(1)")));
        driver.findElement(By.cssSelector("button:nth-child(1)")).click(); // Click Admin button
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Admin-email")));
        driver.findElement(By.id("Admin-email")).sendKeys("admin@test.com");
        driver.findElement(By.id("Admin-password")).sendKeys("adminpassword");
        driver.findElement(By.id("Admin-button")).click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/"));
        Assert.assertEquals("Should redirect to home page after successful login", "http://localhost:3000/", driver.getCurrentUrl());
    }

    @Test
    public void testFailedLoginIncorrectPassword() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-email")));
        driver.findElement(By.id("User-email")).sendKeys("user@test.com");
        driver.findElement(By.id("User-password")).sendKeys("wrongpassword");
        driver.findElement(By.id("User-button")).click();
        Assert.assertEquals("Should redirect to home page after successful login", "http://localhost:3000/", driver.getCurrentUrl());
    }

    @Test
    public void testFailedLoginNonexistentUser() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-email")));
        driver.findElement(By.id("User-email")).sendKeys("nonexistent@test.com");
        driver.findElement(By.id("User-password")).sendKeys("password123");
        driver.findElement(By.id("User-button")).click();
        Assert.assertEquals("Should redirect to home page after successful login", "http://localhost:3000/", driver.getCurrentUrl());
    }
//
    @Test
    public void testFailedLoginEmptyFields() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-button")));
        driver.findElement(By.id("User-button")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals("Should remain on login page when fields are empty", "http://localhost:3000/login", currentUrl);
    }

    @Test
    public void testFailedLoginInvalidEmail() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-email")));
        driver.findElement(By.id("User-email")).sendKeys("invalidemail");
        driver.findElement(By.id("User-password")).sendKeys("password123");
        driver.findElement(By.id("User-button")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals("Should remain on login page for invalid email", "http://localhost:3000/login", currentUrl);
    }

    @Test
    public void testToggleBetweenUserTypes() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button:nth-child(1)")));
        driver.findElement(By.cssSelector("button:nth-child(1)")).click(); // Click Admin button
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Admin-email")));
        Assert.assertTrue("Admin login form should be visible", driver.findElement(By.id("Admin-email")).isDisplayed());

        driver.findElement(By.cssSelector("button:nth-child(2)")).click(); // Click Owner button
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Owner-email")));
        Assert.assertTrue("Owner login form should be visible", driver.findElement(By.id("Owner-email")).isDisplayed());

        driver.findElement(By.cssSelector("button:nth-child(3)")).click(); // Click User button
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-email")));
        Assert.assertTrue("User login form should be visible", driver.findElement(By.id("User-email")).isDisplayed());
    }

    @Test
    public void testNavigateToSignUp() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.linkText("Sign Up")));
        driver.findElement(By.linkText("Sign Up")).click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/signup"));
        Assert.assertEquals("Should navigate to signup page", "http://localhost:3000/signup", driver.getCurrentUrl());
    }

    @Test
    public void testNavigateToPasswordReset() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.linkText("Reset Password")));
        driver.findElement(By.linkText("Reset Password")).click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/password-reset"));
        Assert.assertEquals("Should navigate to password reset page", "http://localhost:3000/password-reset", driver.getCurrentUrl());
    }
}
