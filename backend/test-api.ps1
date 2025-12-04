# Shoppii API Test Script
# PowerShell script to test all API endpoints

$BASE_URL = "http://localhost:3000/api"

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body,
        [string]$Token
    )
    
    Write-Host "`n========================================" -ForegroundColor Blue
    Write-Host "$Method $Endpoint" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Blue
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        $url = "$BASE_URL$Endpoint"
        $params = @{
            Uri     = $url
            Method  = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = $Body | ConvertTo-Json
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "[OK]" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3)
        return $response
    }
    catch {
        Write-Host "[ERROR]" -ForegroundColor Red
        Write-Host $_.Exception.Message
        return $null
    }
}

# AUTH TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== AUTH ENDPOINTS ==========" -ForegroundColor Blue

# Login
$loginBody = @{
    email    = "c1@mail.com"
    password = "1234"
}
$loginRes = Test-Endpoint -Name "Login" -Method "POST" -Endpoint "/auth/login" -Body $loginBody
$token = $loginRes.token

# Get Profile
Test-Endpoint -Name "Get Profile" -Method "GET" -Endpoint "/auth/profile" -Token $token

# PRODUCT TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== PRODUCT ENDPOINTS ==========" -ForegroundColor Blue

# Get All Products
Test-Endpoint -Name "Get Products" -Method "GET" -Endpoint "/products"

# Get Product By ID
Test-Endpoint -Name "Get Product 1" -Method "GET" -Endpoint "/products/1"

# CART TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== CART ENDPOINTS ==========" -ForegroundColor Blue

# Get Cart
Test-Endpoint -Name "Get Cart" -Method "GET" -Endpoint "/cart" -Token $token

# Add to Cart
$addCartBody = @{
    itemId   = 1
    quantity = 2
}
Test-Endpoint -Name "Add to Cart" -Method "POST" -Endpoint "/cart/add" -Body $addCartBody -Token $token

# Get Cart Again
Test-Endpoint -Name "Get Cart After Add" -Method "GET" -Endpoint "/cart" -Token $token

# ORDER TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== ORDER ENDPOINTS ==========" -ForegroundColor Blue

# Get Orders
Test-Endpoint -Name "Get My Orders" -Method "GET" -Endpoint "/orders" -Token $token

# Get Order By ID
Test-Endpoint -Name "Get Order 1" -Method "GET" -Endpoint "/orders/1" -Token $token

# SHOP TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== SHOP ENDPOINTS ==========" -ForegroundColor Blue

# Get All Shops
Test-Endpoint -Name "Get All Shops" -Method "GET" -Endpoint "/shops"

# Get Shop By ID
Test-Endpoint -Name "Get Shop 1" -Method "GET" -Endpoint "/shops/1"

# CATEGORY TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== CATEGORY ENDPOINTS ==========" -ForegroundColor Blue

# Get All Categories
Test-Endpoint -Name "Get Categories" -Method "GET" -Endpoint "/categories"

# REVIEW TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== REVIEW ENDPOINTS ==========" -ForegroundColor Blue

# Get Reviews
Test-Endpoint -Name "Get Reviews" -Method "GET" -Endpoint "/reviews"

# Get My Reviews
Test-Endpoint -Name "Get My Reviews" -Method "GET" -Endpoint "/reviews/my-reviews" -Token $token

# VOUCHER TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== VOUCHER ENDPOINTS ==========" -ForegroundColor Blue

# Get Vouchers
Test-Endpoint -Name "Get Vouchers" -Method "GET" -Endpoint "/vouchers"

# SHIPPING TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== SHIPPING ENDPOINTS ==========" -ForegroundColor Blue

# Get Shipping Methods
Test-Endpoint -Name "Get Shipping" -Method "GET" -Endpoint "/shipping"

# ADMIN TESTS
Write-Host "`n`n" -ForegroundColor Blue
Write-Host "========== ADMIN ENDPOINTS ==========" -ForegroundColor Blue

# Login as Admin
$adminLoginBody = @{
    email    = "admin1@mail.com"
    password = "1234"
}
$adminLoginRes = Test-Endpoint -Name "Admin Login" -Method "POST" -Endpoint "/auth/login" -Body $adminLoginBody
$adminToken = $adminLoginRes.token

# Get Dashboard
if ($adminToken) {
    Test-Endpoint -Name "Get Admin Dashboard" -Method "GET" -Endpoint "/admin/dashboard" -Token $adminToken
    
    # Get All Users
    Test-Endpoint -Name "Get All Users" -Method "GET" -Endpoint "/admin/users" -Token $adminToken
    
    # Get All Shops
    Test-Endpoint -Name "Get All Shops (Admin)" -Method "GET" -Endpoint "/admin/shops" -Token $adminToken
    
    # Get All Orders (Admin)
    Test-Endpoint -Name "Get All Orders (Admin)" -Method "GET" -Endpoint "/admin/orders" -Token $adminToken
    
    # Get All Products (Admin)
    Test-Endpoint -Name "Get All Products (Admin)" -Method "GET" -Endpoint "/admin/products" -Token $adminToken
    
    # Get All Reviews (Admin)
    Test-Endpoint -Name "Get All Reviews (Admin)" -Method "GET" -Endpoint "/admin/reviews" -Token $adminToken
}

Write-Host "`n`nAPI TEST COMPLETED!" -ForegroundColor Green
