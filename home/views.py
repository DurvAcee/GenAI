from django.http import JsonResponse
from django.shortcuts import render, HttpResponse
import requests

# Create your views here.
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

def about(request):
   return render(request, 'about.html')

def service(request):
    return HttpResponse('this is service page')
