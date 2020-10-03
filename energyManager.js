class EnergyManager{
    constructor(x,y){
        this.diagramCanvas = new Canvas();
        this.diagramCanvas.resize(400,350);
        this.diagramCanvas.resizeStyle(400,350,true);
        this.diagramCanvas.appendSelf();

        //Parameters for U, ΔQ and ΔW
        //U is the total energy held by an entity
        this.uField = 0;
        this.uGrass = 0;
        this.uDeadgrass = 0;
        //ΔQ is energy moved from one entity to another
        this.sampleSize = 60;
        this.clock = 0;
        this.qSunToField = new Array(this.sampleSize).fill(0);
        this.qSunToGrass = new Array(this.sampleSize).fill(0);
        this.qSunToDeadgrass = new Array(this.sampleSize).fill(0);
        this.qFieldToGrass = new Array(this.sampleSize).fill(0);
        this.qGrassToDeadgrass = new Array(this.sampleSize).fill(0);
        this.qDeadgrassToField = new Array(this.sampleSize).fill(0);
        this.qGrassToHerbivore = new Array(this.sampleSize).fill(0);
        this.qSunToFieldTotal = 0;
        this.qSunToGrassTotal = 0;
        this.qSunToDeadgrassTotal = 0;
        this.qFieldToGrassTotal = 0;
        this.qGrassToDeadgrassTotal = 0;
        this.qDeadgrassToFieldTotal = 0;
        this.qGrassToHerbivoreTotal = 0;

        //ΔW is energy consumed (lost)
        this.wGrass = new Array(this.sampleSize).fill(0);
        this.wHerbivore = new Array(this.sampleSize).fill(0);
        this.wGrassTotal = 0;
        this.wHerbivoreTotal = 0;

        //Diagram constants
        this.areaFactor = 3/1000;
        this.arrowFactor = 50/Q_in;
    }
    updateMonitor(){
        //Update clock
        this.clock = (this.clock+1)%this.sampleSize;

        //Reset U values
        this.uField = 0;
        this.uGrass = 0;
        this.uDeadgrass = 0;

        //Reset Q arrays
        this.qSunToFieldTotal -= this.qSunToField[this.clock];
        this.qSunToField[this.clock] = 0;
        this.qSunToGrassTotal -= this.qSunToGrass[this.clock];
        this.qSunToGrass[this.clock] = 0;
        this.qSunToDeadgrassTotal -= this.qSunToDeadgrass[this.clock];
        this.qSunToDeadgrass[this.clock] = 0;
        this.qFieldToGrassTotal -= this.qFieldToGrass[this.clock];
        this.qFieldToGrass[this.clock] = 0;
        this.qGrassToDeadgrassTotal -= this.qGrassToDeadgrass[this.clock];
        this.qGrassToDeadgrass[this.clock] = 0;
        this.qDeadgrassToFieldTotal -= this.qDeadgrassToField[this.clock];
        this.qDeadgrassToField[this.clock] = 0;
        this.qGrassToHerbivoreTotal -= this.qGrassToHerbivore[this.clock];
        this.qGrassToHerbivore[this.clock] = 0;

        //Reset W arrays
        this.wGrassTotal -= this.wGrass[this.clock];
        this.wGrass[this.clock] = 0;
        this.wHerbivoreTotal -= this.wHerbivore[this.clock];
        this.wHerbivore[this.clock] = 0;
    }
    getText(number,digitsToShow = 2){
        const digits = Math.floor(Math.log(number)/Math.log(10));
        const newNum = Math.floor(number*Math.pow(10,-digits+digitsToShow))*Math.pow(10,+digits-digitsToShow);
        if(digits/3>=2){
            return newNum/1000000+"[M";
        }else if(digits/3>=1){
            return newNum/1000+"[k";
        }else{
            return newNum+"[";
        }
    }
    drawDiagram(){
        this.diagramCanvas.fillAll("white");
        this.diagramCanvas.drawRect(0,0,400,350,"black");
        //Get width heigth for each entity
        const textHeight = 12;
        const maxFieldWidth = 200;
        const maxDeadgrassWidth = 100;
        const maxGrassWidth = 200;
        const boxGap = 100;
        const boxGapVertical = 30;
        let arrowWidth = 0;
        
        //Draw Field Box
        const fieldx = boxGap;
        const fieldy = boxGapVertical*1.5;
        const [fieldWidth,fieldHeight] = this.getWidthHeight(this.uField*this.areaFactor,textHeight,maxFieldWidth);
        this.diagramCanvas.fillRect(fieldx,fieldy,fieldWidth,fieldHeight,"yellow");
        this.diagramCanvas.drawRect(fieldx,fieldy,fieldWidth,fieldHeight,"black");
        if(fieldHeight>=textHeight){
            const text = "U:"+this.getText(this.uField)+"J]";
            const x = fieldx+fieldWidth/2;
            const y = fieldy+fieldHeight/2;
            this.diagramCanvas.text(text,x,y,"black",textHeight+"px 'Arial'","center","middle");
        }
        //Arrow Sun → Field
        arrowWidth = this.qSunToFieldTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2)
            this.diagramCanvas.drawHorizontalArrow(0,fieldy+fieldHeight/2,boxGap,fieldy+fieldHeight/2,arrowWidth);
        if(arrowWidth>textHeight){
            const text = "Qin:"+this.getText(this.qSunToFieldTotal/this.sampleSize)+"W]";
            const x = fieldx/2;
            const y = fieldy+fieldHeight/2;
            this.diagramCanvas.text(text,x,y,"black",textHeight+"px 'Arial'","center","middle");
        }

        const deadgrassx = boxGap;
        const deadgrassy = fieldy + fieldHeight + boxGapVertical;
        const [deadgrassWidth,deadgrassHeight] = this.getWidthHeight(this.uDeadgrass*this.areaFactor,textHeight,maxDeadgrassWidth);
        this.diagramCanvas.fillRect(deadgrassx,deadgrassy,deadgrassWidth,deadgrassHeight,"brown");
        this.diagramCanvas.drawRect(deadgrassx,deadgrassy,deadgrassWidth,deadgrassHeight,"black");
        //Arrow Sun → Deadgrass
        arrowWidth = this.qSunToDeadgrassTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2)
            this.diagramCanvas.drawHorizontalArrow(0,deadgrassy+deadgrassHeight/2,boxGap,deadgrassy+deadgrassHeight/2,arrowWidth);
        //Arrow Grass → Deadgrass
        arrowWidth = this.qDeadgrassToFieldTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2)
            this.diagramCanvas.drawVerticalArrow(deadgrassx+deadgrassWidth/2,deadgrassy,deadgrassx+deadgrassWidth/2,fieldy+fieldHeight,arrowWidth);

        const grassx = boxGap;
        const grassy = deadgrassy + deadgrassHeight + boxGapVertical;
        const [grassWidth,grassHeight] = this.getWidthHeight(this.uGrass*this.areaFactor,textHeight,maxGrassWidth);
        this.diagramCanvas.fillRect(grassx,grassy,grassWidth,grassHeight,"lime");
        this.diagramCanvas.drawRect(grassx,grassy,grassWidth,grassHeight,"black");
        if(grassHeight>=textHeight){
            const text = "U:"+this.getText(this.uGrass)+"J]";
            const x = grassx+grassWidth/2;
            const y = grassy+grassHeight/2;
            this.diagramCanvas.text(text,x,y,"black",textHeight+"px 'Arial'","center","middle");
        }
        //Arrow Sun → Grass
        arrowWidth = this.qSunToGrassTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2)
            this.diagramCanvas.drawHorizontalArrow(0,grassy+grassHeight/2,boxGap,grassy+grassHeight/2,arrowWidth);
        //Arrow Field → Grass
        arrowWidth = this.qFieldToGrassTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2)
            this.diagramCanvas.drawVerticalArrow(grassx+grassWidth/2,fieldy+fieldHeight,grassx+grassWidth/2,grassy,arrowWidth);
        //Arrow Grass → Deadgrass
        arrowWidth = this.qGrassToDeadgrassTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2)
            this.diagramCanvas.drawVerticalArrow(deadgrassx+deadgrassWidth/2,grassy,deadgrassx+deadgrassWidth/2,deadgrassy+deadgrassHeight,arrowWidth);
        //Arrow Grass → Out
        arrowWidth = this.wGrassTotal/this.sampleSize*this.arrowFactor;
        if(arrowWidth>2){
            this.diagramCanvas.drawVerticalArrow(grassx+grassWidth/2,grassy+grassHeight,grassx+grassWidth/2,350,arrowWidth);
            const text = this.getText(this.wGrassTotal/this.sampleSize)+"W]";
            const x = grassx+grassWidth/2;
            const y = (grassy+grassHeight+350)/2-textHeight;
            this.diagramCanvas.text("W out:",x,y-textHeight,"black",textHeight+"px 'Arial'","center","middle");
            this.diagramCanvas.text(text,x,y,"black",textHeight+"px 'Arial'","center","middle");

        }

        return;
        this.diagramCanvas.text("qSunToField:"+this.qSunToFieldTotal);
        this.diagramCanvas.text("qSunToGrass:"+this.qSunToGrassTotal,0,10);
        this.diagramCanvas.text("qSunToDeadG:"+this.qSunToDeadgrassTotal,0,20);
        this.diagramCanvas.text("qFieldToGra:"+this.qFieldToGrassTotal,0,30);
        this.diagramCanvas.text("qGratoDead :"+this.qGrassToDeadgrassTotal,0,40);
        this.diagramCanvas.text("qDeadToFiel:"+this.qDeadgrassToFieldTotal,0,50);
        this.diagramCanvas.text("uField     :"+this.uField,0,70);
        this.diagramCanvas.text("uGrass     :"+this.uGrass,0,80);
        this.diagramCanvas.text("uDeadgrass :"+this.uDeadgrass,0,90);
        this.diagramCanvas.text("w Grass    :"+this.wGrassTotal,0,110);

    }
    getWidthHeight(value,minHeight,maxWidth){
        if(value<(minHeight+2)){
            return [1,value];
        }
        if(value<(minHeight+2)*maxWidth){
            const width = Math.floor(value/(minHeight+2));
            return [width,(minHeight+2)];
        }
        const height = Math.floor(value/maxWidth);
        return [maxWidth,height];
    }
}

console.log("Loaded: energyManager.js");