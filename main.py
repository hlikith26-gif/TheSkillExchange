from pyscript import document
import random
import math
from textblob import TextBlob, Word

def randomize():
    subjects = {    
        "1":"Mathematics",
        "2":"Physics",
        "3":"Chemistry",
        "4":"Biology",
        "5":"History",
        "6":"Political Sciences",
        "7":"Geography",
        "8":"Law",
        "9":"Computer Science",
        "10":"Financial Literacy",
        "11":"Indian Languages",
        "12":"Foreign Languages",
        "13":"others"
    }


    Randomization=random.randint(1,13)

def powerer(event):
    bsno = float(document.getElementById("bsno").value)
    pwno = float(document.getElementById("pwno").value)
    r = bsno**pwno
    document.getElementById("pdisplay").innerText = f"Result = {r}"

    x=int(input("enter a number"))
    math.sqrt(x)
    print(x)

    y=int(input('enter a number'))
    math.cbrt(y)
    print(y)


