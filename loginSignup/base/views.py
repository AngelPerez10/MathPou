from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .forms import SignUpForm
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    return render(request, "home.html", {})

def index(request):
    return render(request, "index.html", {})

def authView(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("base:index")
    else:
        form = SignUpForm()
    return render(request, "registration/signup.html", {"form": form})
