from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import requests
import json

def index(request):
    context = {
        'variable' : "This is sent!"
    }
    return render(request, 'index.html', context)

# /localbot/welcome/
def fetch_initial_message(request):
    api_url = 'https://mocki.io/v1/ad9c060a-dd91-427f-b47c-99706b866d88'                
    try:
        response = requests.get(api_url, verify=False)
        response.raise_for_status()
        data = response.json()
        return JsonResponse(data)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# /localbot/prompt
@csrf_exempt
@require_http_methods(["POST"])
def process_message(request):
    try:
        data = json.loads(request.body) 
        chat_session_id = data.get('chat_session_id')
        message = data.get('message')

        api_url = 'https://mocki.io/v1/93a0821a-c725-43e1-8037-711ce92b1db3'
        params = {
            'chat_session_id': chat_session_id,
            'message': message
        }
        response = requests.get(api_url, params=params, verify=False)
        response.raise_for_status()
        api_response = response.json()
        return JsonResponse(api_response)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)
