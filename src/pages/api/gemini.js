import { GoogleGenerativeAI } from "@google/generative-ai";

async function recognizeObject(req, res) {
    const capturedImage = req.body;

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    console.log('THE MODEL IS: ', model, '\n\n');

    const image = {
        inlineData: {
        data : capturedImage.split(',')[1],
        mimeType : "image/jpeg"
        },
    };

    // const imageName = `pantry-items/${Date.now()}.jpg`;
    // const storageRef = ref(storage, imageName);
    // await uploadString(storageRef, capturedImage, 'data_url');
    // const imageUrl = await getDownloadURL(storageRef);
    // console.log(imageUrl);
  
    try {
      const result = await model.generateContent([
          "Idententify the food items in the image file and return result in json formate with keys name, item description and quantity and their corresponding values without ```json in the begining",
          image,
        ]);
      console.log('\n\nResponse is: ', result.response);
      console.log(result.response.text(), '\n\n');

      const res = JSON.parse(result.response.text());
      console.log(res);
      console.log(res.name);

      const itemName = res.name;
      const itemQuantity = res.quantity || 1; // Assume quantity is 1 if not returned

      console.log('Items details: ', itemName, itemQuantity);

      return JSON.stringify({
        "itemName": itemName,
        "itemQuantity": itemQuantity
      })
  } catch (error) {
      console.error('Error sending image to Gemini API:', error);
  }
}
  
export {recognizeObject};