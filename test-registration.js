// Test script for registration API
// Replace YOUR_VERCEL_URL with your actual Vercel deployment URL

const testRegistration = async () => {
    const testData = {
        name: "Test User",
        email: "test@example.com",
        phone: "+1-555-0123",
        jobTitle: "Test Advisor",
        tier: "Free",
        greetingText: "Hello! I'm testing the registration system.",
        instagramUrl: "",
        linkedinUrl: "",
        facebookUrl: "",
        googleReviewUrl: "",
        qaBank: ""
    };

    try {
        console.log('Testing registration with data:', testData);
        
        // Replace with your actual Vercel URL
        const response = await fetch('https://your-app.vercel.app/api/onboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', result);

        if (response.ok) {
            console.log('✅ Registration successful!');
            console.log('📝 Record ID:', result.recordId);
            console.log('🔗 Card URL:', result.cardUrl);
            console.log('👤 Slug:', result.slug);
        } else {
            console.error('❌ Registration failed:', result.error);
            if (result.details) {
                console.error('Details:', result.details);
            }
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
};

// Run the test
testRegistration();
