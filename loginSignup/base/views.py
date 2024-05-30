from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm

@login_required
def home(request):
    return render(request, "home.html", {})

@login_required
def index(request):
    return render(request, "index.html", {})

def authView(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("base:login")  # Ensure the correct namespace is used
    else:
        form = SignUpForm()
    return render(request, "registration/signup.html", {"form": form})
