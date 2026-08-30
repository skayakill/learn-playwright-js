const { defineconfig } = require('@playwright/test');
export default defineconfig({
    use: {
        // Add request we send go to this Endpoint.
        baseUrl: 'https://reqres.in/api',
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }  
    },
});