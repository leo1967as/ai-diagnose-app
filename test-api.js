async function testAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        age: 25,
        sex: 'male',
        weight: 70,
        height: 170,
        symptoms: 'fever and cough',
        symptom_duration: '2 days',
        previous_meal: 'fried rice'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();