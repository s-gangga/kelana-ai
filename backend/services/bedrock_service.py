import os
import boto3
from dotenv import load_dotenv

load_dotenv()

# Inisialisasi Bedrock Runtime Client
client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2")
)

def generate_trip_recommendation(destination: str, days: int, budget: float, travel_style: str = "Standard") -> str:
    """
    Mengirimkan prompt kaya konteks ke Amazon Bedrock (Converse API)
    dan mengembalikan itinerary perjalanan berformat Markdown.
    """
    # Konstruksi Richer Prompt sesuai kriteria Homework & Challenge Sesi 5
    prompt = f"""
    You are an expert travel planner. Create a detailed daily travel itinerary for a trip to {destination}.
    
    Trip Details:
    - Destination: {destination}
    - Duration: {days} days
    - Total Budget: USD {budget}
    - Travel Style: {travel_style}
    
    Requirements for the output:
    1. Provide a structured daily plan for each of the {days} days.
    2. For each day, include:
       - **Morning activities**: 2-3 specific morning activities.
       - **Afternoon activities**: Cultural sites, local experiences, or iconic attractions.
       - **Evening activities**: Recommended dinner spots and nightlife or relaxing evening options.
    3. Include estimated daily costs, transportation advice, and local food suggestions.
    4. Format the entire response strictly in clean Markdown using headers (##) and bullet lists (-).
    """

    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    # Memanggil Amazon Bedrock menggunakan Converse API
    response = client.converse(
        modelId=model_id,
        messages=[
            {
                "role": "user",
                "content": [
                    {"text": prompt}
                ]
            }
        ]
    )

    # Ekstraksi hasil balasan teks dari AI
    ai_text = response["output"]["message"]["content"][0]["text"]
    return ai_text