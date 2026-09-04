from pyscript import document
import random
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

def powerer():
    n1 = document.getElementById("number1")
    n2 = document.getElementById("number2")
    r = n1**n2
    document.getElementById("display").innerText = r


