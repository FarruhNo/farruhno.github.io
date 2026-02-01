class upgrade{
	constructor(name, description, affects, value, sign, price, icon){
		this.name = name
		this.description = description
		this.affects = affects
		this.value = value
		this.sign = sign
		this.price = price
		this.icon = icon
	}
}


let upgrades = [new upgrade("More hands", "+1 click power", "CP", 1, '+', 10, "hand-right"),
				new upgrade("Hire employees", "+1 clicks per second", "CPS", 1, '+', 100, "people"),
				new upgrade("Gym day", "x2 click power", "CP", 2, 'x', 500, "barbell"),
				new upgrade("Motivated employees", "x2 clicks per second", "CPS", 2, 'x', 1000, "battery-charging"),
				new upgrade("Working overtime", "Click power ^ 1.1", "CPS", 1.1, '^', 1000000, "alarm"),
				new upgrade("Training campain", "Clicks per second ^ 1.1", "CPS", 1.1, '^', 5000000, "bar-chart")]
let click = 0
let baseCP = 1
let toAdd = baseCP
let multiplier = 1
let powered = 1

upgradeMenu = document.getElementById('upgradeMenu');
clickLabel = document.getElementById('click');


const formatCompactNumber = (number) => {
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(number);
};


function Increment() {
	click += toAdd
	clickLabel.innerHTML = `$${formatCompactNumber(click)}`;
}


function Upgrade(index, change, sign, affects, event) {
	if (click >= upgrades[index].price){
		click -= Math.round(upgrades[index].price)
		clickLabel.innerHTML = `$${formatCompactNumber(click)}`;
		upgrades[index].price **= 1.2;
		event.target.innerHTML = `$${formatCompactNumber(Math.round(upgrades[index].price))}`;
		if (affects == "CP"){
			if (sign == '+'){
				baseCP += 1
			}
			else if (sign == 'x'){
				multiplier *= 2
			}
			else{
				powered *= 1.1
			}
		}
		toAdd = (baseCP * multiplier) ** powered
	}
}


for (let i = 0; i < upgrades.length; i++) {
    const up = upgrades[i]; // Short reference
    const newUpgrade = document.createElement("div");
    newUpgrade.className = "upgrade";

    // Build the entire structure as a string
    newUpgrade.innerHTML = `
        <div class="left">
            <ion-icon name="${up.icon}"></ion-icon>
            <div class="content">
                <h2>${up.name}</h2>
                <p>${up.description}</p>
            </div>
        </div>
        <button id="buy-${i}">$${formatCompactNumber(up.price)}</button>
    `;

    upgradeMenu.appendChild(newUpgrade);

    // Add the listener to the button we just created inside the HTML string
    const btn = newUpgrade.querySelector('button');
    btn.addEventListener('click', () => {
        Upgrade(i, up.value, up.sign, up.affects, event);
    });
}