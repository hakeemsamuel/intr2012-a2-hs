let sketch = (p) => {
    let angleOffset = 0;

    p.setup = function () {
        let cnv = p.createCanvas(400, 400);
        cnv.parent("palette");
        p.colorMode(p.HSB);
        p.noStroke();
        p.angleMode(p.DEGREES);
        p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = function () {
        p.background(255);
        for (let angle = 0; angle < 360; angle += 30) {
            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.rotate(angle + angleOffset);
            p.translate(150, 0);
            p.fill(angle, 85, 90);
            p.circle(0, 0, 50);
            p.translate(-50, 0);
            p.rotate(-angle - angleOffset);
            p.fill(0);
            p.text(`${angle}°`, 0, 0);
            p.pop();
        }
        angleOffset += 0.2;
    };
};

new p5(sketch);