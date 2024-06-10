

function check(button) {

}

function showanswer() {
    
}


// 
// THAT PUZZLE FROM THE NYT ABOUT FIGURING OUT IT ACCEPTS ANY 3 SEQUENTIAL #S
// 


var rules = true;
var randomness = false;

function mark(button) {
    if (rules)
    {
        // Check if row is locked (and you're not trying to unlock it)
        if (button.parentNode.classList.contains("marked")
            && ! button.nextElementSibling.classList.contains("lock"))
        {
            return;
        }
        // Check if anything later in the row is marked
        var sibling = button.nextElementSibling;
        while (sibling)
        {
            if (sibling.classList.contains("marked")) return;
            sibling = sibling.nextElementSibling;
        }
        // If the last number is clicked, check if 5 spaces were
        if (button.classList.contains("last"))
        {
            sibling = button.parentElement.firstElementChild;
            var counter = 0;
            while (sibling != button)
            {
                if (sibling.classList.contains("marked")) counter++;
                sibling = sibling.nextElementSibling;
            }
            if (counter < 5) return;
        }
        // If the lock is clicked, check if the last number was
        if (button.nextElementSibling.classList.contains("lock"))
        {
            if ( ! button.previousElementSibling.classList.contains("marked"))
            {
                return
            }
        }
    }

    // Flip whether the space is marked
    button.classList.toggle("marked");

    // If following rules, auto-lock after last number
    if (rules && button.classList.contains("last"))
    {
        mark(button.nextElementSibling);
    }
    if (rules && button.nextElementSibling.classList.contains("lock"))
    {
        lock(button.nextElementSibling);
    }
}

function penalty(button) {
    if (button.innerHTML == "X") {button.innerHTML = "&nbsp";}
    else {button.innerHTML = "X";}

    // If all penalties are used, game over
    if (rules && button.innerHTML == "X")
    {
        var sibling = button.parentElement.nextElementSibling;
        while (sibling)
        {
            if (sibling.firstElementChild.innerHTML != "X") return;
            sibling = sibling.nextElementSibling;
        }
        sibling = button.parentElement.previousElementSibling;
        while (sibling)
        {
            if (sibling.firstElementChild.innerHTML != "X") return;
            sibling = sibling.previousElementSibling;
        }
        calculate();
    }
}

function lock(button) {
    if (button.textContent == "Lock")
    {
        button.textContent = "Unlock";
        button.parentElement.classList.toggle("marked");
    }
    else {
        unlock(button);
    }

    if (rules)
    {
        // Toggle die
        var die = button.parentElement.firstElementChild;
        if (die.classList.contains("red"))
            document.getElementById("red_die").classList.toggle("marked");
        if (die.classList.contains("yellow"))
            document.getElementById("yellow_die").classList.toggle("marked");
        if (die.classList.contains("green"))
            document.getElementById("green_die").classList.toggle("marked");
        if (die.classList.contains("blue"))
            document.getElementById("blue_die").classList.toggle("marked");

        // If two rows are locked, calculate score (end game)
        if (button.parentElement.classList.contains("marked"))
        {
            var row = button.parentElement.previousElementSibling;
            while (row)
            {
                if (row.classList.contains("marked"))
                {
                    calculate();
                    break;
                }
                row = row.previousElementSibling;
            }
            row = button.parentElement.nextElementSibling;
            while (row.firstElementChild.classList.contains("number"))
            {
                if (row.classList.contains("marked"))
                {
                    calculate();
                    break;
                }
                row = row.nextElementSibling;
            }
        }
    }
}

function unlock(button) {
    button.textContent = "Lock";
    button.parentElement.classList.toggle("marked");

    if (rules)
    {
        button.previousElementSibling.classList.remove("marked");
    }
}

function restart() {
    if (confirm("Are you sure you want to clear the board?")) {
        Things = document.getElementsByClassName('marked');
        for (var i = Things.length - 1; i >= 0; i--) {
            Things[i].classList.remove('marked');
        }

        Locks = document.getElementsByClassName('lock');
        for (var i = 0; i < Locks.length; i++) {
            Locks[i].innerHTML = "Lock";
        }

        penalties = document.getElementsByClassName('penalty-counter');
        for (var i = 0; i < penalties.length; i++) {
            penalties[i].innerHTML = "&nbsp;";
        }

        document.getElementById("white_die1").firstElementChild.src = "images/borderq.gif";
        document.getElementById("white_die2").firstElementChild.src = "images/borderq.gif";
        document.getElementById("red_die").firstElementChild.src = "images/redq.gif";
        document.getElementById("yellow_die").firstElementChild.src = "images/yellowq.gif";
        document.getElementById("green_die").firstElementChild.src = "images/greenq.gif";
        document.getElementById("blue_die").firstElementChild.src = "images/blueq.gif";

       clear_score();
    }
}

function clear_score() {
    document.getElementById('red-score').textContent = "";
    document.getElementById('yellow-score').textContent = "";
    document.getElementById('green-score').textContent = "";
    document.getElementById('blue-score').textContent = "";
    document.getElementById('penalty-score').textContent = "";
    document.getElementById('total-score').textContent = "";
}

function calculate() {
    r = count_up("red");
    y = count_up("yellow");
    g = count_up("green");
    b = count_up("blue");
    
    p = 0;
    penalties = document.getElementsByClassName('penalty-counter');
    for (var i = 0; i < penalties.length; i++) {
        if (penalties[i].textContent == "X")
        {
            p += 5;
        }
    }

    total = r + y + g + b - p;
    
    document.getElementById('red-score').textContent = r;
    document.getElementById('yellow-score').textContent = y;
    document.getElementById('green-score').textContent = g;
    document.getElementById('blue-score').textContent = b;
    document.getElementById('penalty-score').textContent = p;
    document.getElementById('total-score').textContent = total;
}

function count_up(color) {
    points = 0;
    boxes = document.getElementsByClassName('number ' + color);
    
    var j = 0;
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].classList.contains("marked"))
        {
            j++;
            points += j;
        }
    }

    return points;
}
