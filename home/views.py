from django.shortcuts import render, HttpResponse

# Create your views here.
def index(request):
    context = {
        'variable' : "This is sent!"
    }
    return render(request, 'index.html', context)

def about(request):
   return render(request, 'about.html')

def service(request):
    return HttpResponse('this is service page')
