from pyscript import document
import random
import math



def powerer(event):
    bsno = float(document.getElementById("bsno").value)
    pwno = float(document.getElementById("pwno").value)
    r = bsno**pwno
    document.getElementById("pdisplay").innerText = f"Result = {r}"

def sqroot(event):
    nsq1 = float(document.getElementById("nsq1").value)
    re = math.sqrt(nsq1)
    document.getElementById("sqdisplay").innerText = f"Result = {re}"
def curoot(event):
    ncu1 = float(document.getElementById("ncu1").value)
    re = math.cbrt(ncu1)
    document.getElementById("cudisplay").innerText = f"Result = {re}"
