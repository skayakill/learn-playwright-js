const{test,expect}=require('@playwright/test');

test('listdemo',async({page})=>{
    await page.goto('https://login.salesforce.com/');
    
});