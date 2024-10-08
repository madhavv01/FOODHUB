package org.example;
import java.time.Duration;
import java.util.List;

import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RestaurantTest {

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
        login();
    }

    @After
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private void login() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-email")));
        driver.findElement(By.id("User-email")).sendKeys("test@test.com");
        driver.findElement(By.id("User-password")).sendKeys("testtest");
        driver.findElement(By.id("User-button")).click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/"));
    }

    // Home page

    @Test
    public void testHomePageLoadedCorrectly() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("home")));
        WebElement homeElement = driver.findElement(By.className("home"));
        Assert.assertNotNull("Home page should be loaded", homeElement);
    }

    @Test
    public void testRestaurantListDisplayed() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-list")));
        WebElement restaurantList = driver.findElement(By.className("restaurant-list"));
        Assert.assertNotNull("Restaurant list should be displayed", restaurantList);
    }

    @Test
    public void testRestaurantLinksClickable() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        WebElement firstRestaurantLink = driver.findElement(By.className("restaurant-link"));
        firstRestaurantLink.click();
        wait.until(ExpectedConditions.urlContains("/restaurant/"));
        Assert.assertTrue("URL should contain '/restaurant/'", driver.getCurrentUrl().contains("/restaurant/"));
    }


    @Test
    public void testIncorrectTimeStampOnNotes() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Add-Note-1")));
        driver.findElement(By.id("Add-Note-1")).click();
        driver.findElement(By.id("Note-Input-1")).sendKeys("Test note with timestamp");
        driver.findElement(By.id("Add-1")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".food-notes li")));
        WebElement noteElement = driver.findElement(By.cssSelector(".food-notes li"));
        Assert.assertTrue("Note should have a timestamp", noteElement.getText().matches(".*\\d{2}:\\d{2}:\\d{2}.*"));
    }

    @Test (expected= NoSuchElementException.class)
    public void testIncorrectEditNoteFunction() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Add-Note-1")));
        driver.findElement(By.id("Add-Note-1")).click();
        driver.findElement(By.id("Note-Input-1")).sendKeys("Note to be edited");
        driver.findElement(By.id("Add-1")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".food-notes li")));
        List<WebElement> editButton = driver.findElements(By.cssSelector(".food-notes li .edit-button"));
        Assert.assertTrue("Edit button should exist", editButton.isEmpty());
    }

    @Test (expected= NoSuchElementException.class)
    public void testIncorrectDeleteNoteForNonAdmin() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Add-Note-1")));
        driver.findElement(By.id("Add-Note-1")).click();
        driver.findElement(By.id("Note-Input-1")).sendKeys("Note to be deleted");
        driver.findElement(By.id("Add-1")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".food-notes li")));
        List<WebElement> deleteButton = driver.findElements(By.cssSelector(".food-notes li span[style*='cursor: pointer']"));
        Assert.assertTrue("Delete button should be visible for non-admin users", deleteButton.isEmpty());
    }

    @Test
    public void testIncorrectAdminDeleteAuthority() {
        driver.get("http://localhost:3000/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("User-email")));
        driver.findElement(By.id("User-email")).sendKeys("admin@test.com");
        driver.findElement(By.id("User-password")).sendKeys("adminpassword");
        driver.findElement(By.id("User-button")).click();
        wait.until(ExpectedConditions.urlToBe("http://localhost:3000/"));

        // Now navigate to the restaurant details page
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("notes-heading-1")));
        driver.findElement(By.id("notes-heading-1")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".food-notes li")));

        List<WebElement> deleteButtons = driver.findElements(By.cssSelector(".food-notes li span[style*='cursor: pointer']"));
        Assert.assertTrue("Admin should not be able to delete notes", deleteButtons.isEmpty());
        // This test will fail because admins actually can delete notes
    }

    // Restaurant Details

    @Test
    public void testLoadRestaurantDetails() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        WebElement firstRestaurant = driver.findElement(By.className("restaurant-link"));
        firstRestaurant.click();
        WebElement restaurantName = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("restaurant-name")));
        Assert.assertEquals("Restaurant name should match", "Rest", restaurantName.getText());
    }

    @Test
    public void testDisplayFoodItems() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".food-card")));
        List<WebElement> foodItems = driver.findElements(By.cssSelector(".food-card"));
        Assert.assertEquals("Should display two food items", 2, foodItems.size());
        String foodItemName = foodItems.get(0).findElement(By.cssSelector("strong")).getText();
        Assert.assertEquals("Food item name should match", "Burger", foodItemName);
    }

    @Test
    public void testAddNoteToFoodItem() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Add-Note-1")));
        driver.findElement(By.id("Add-Note-1")).click();
        driver.findElement(By.id("Note-Input-1")).sendKeys("New test note");
        driver.findElement(By.id("Add-1")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".food-notes li")));
        List<WebElement> notes = driver.findElements(By.cssSelector(".food-notes li"));
        Assert.assertTrue("Notes should not be empty", !notes.isEmpty());
    }

    @Test
    public void testToggleNotesVisibility() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        List<WebElement> hiddenNotes = driver.findElements(By.cssSelector("#food-notes-1 li"));
        Assert.assertEquals("Should have 0 visible notes", 0, hiddenNotes.size());
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("notes-heading-1")));
        WebElement notesHeading = driver.findElement(By.id("notes-heading-1"));
        notesHeading.click();
        List<WebElement> visibleNotes = driver.findElements(By.cssSelector("#food-notes-1 li"));
        Assert.assertTrue("Notes should be visible", !visibleNotes.isEmpty());
    }

    @Test
    public void testFoodHubIconNavigateToHome() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        WebElement firstRestaurant = driver.findElement(By.className("restaurant-link"));
        firstRestaurant.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("restaurant-name")));

        WebElement foodHubIcon = driver.findElement(By.id("navbar-logo"));
        foodHubIcon.click();

        Assert.assertEquals("Food hub icon should navigate to home", "http://localhost:3000/", driver.getCurrentUrl());
    }

    @Test
    public void testInvalidNoteAddition() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Add-Note-1")));
        driver.findElement(By.id("Add-Note-1")).click();

        List<WebElement> notes = driver.findElements(By.cssSelector(".food-notes li"));
        System.out.println(notes.size());

        driver.findElement(By.id("Add-1")).click();

        List<WebElement> notesAfterAdding = driver.findElements(By.cssSelector(".food-notes li"));
        Assert.assertEquals("Empty note should not be added", notes.size(), notesAfterAdding.size());
    }

    @Test
    public void testUnauthorizedNoteDelete() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("restaurant-link")));
        driver.findElement(By.className("restaurant-link")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("Add-Note-1")));

        List<WebElement> deleteIcons = driver.findElements(By.cssSelector(".food-notes li span[style*='cursor: pointer']"));

        Assert.assertTrue("Delete icons should not be visible to unauthorized users", deleteIcons.isEmpty());
    }
    
   
    

}