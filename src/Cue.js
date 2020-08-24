class Cue {
    constructor(name, startTime, type, data="", duration=1){
      this.name = name
      if(typeof startTime == "string" && startTime.indexOf("m") == 0){
        let measure = parseInt(startTime.slice(1))
        console.log(measure)
        for (let index = 0; index < measures.length; index++) {
          if(measures[index]['num'] == measure){
            console.log(measures[index]['startTime'])
            this.startTime = measures[index]['startTime']
            console.log(this.startTime)
            break
          }
        }
      }
      else {
        this.startTime = startTime
      }
      // this.startTime = startTime
      this.duration = duration
      this.data = data
      this.type = type;
      this.height = cueHeight;
      this.startY = topBarHeight+scoreHeight + cueSpacing
      this.hasFired = false
      switch(this.type){
        case "light": 
        case "l":
            this.type = "light"
            this.y = this.startY;
            this.color = lightCueColor;
            break
        case "vid": 
        case "video": 
        case "v":
        case "viz":
            this.type = "video"
            this.y = this.startY + (this.height + cueSpacing);
            this.color = videoCueColor;
            break
        case "sound": 
        case "s":
            this.type = "sound"
            this.y = this.startY + (this.height + cueSpacing)*2;
            this.color = soundCueColor;
            break
        } 
    }
    
    show() {
      if(!this.startX){
        this.startX = getPosFromTime(this.startTime);
        this.x = this.startX;
      }
      stroke(trackColor)
      strokeWeight(1)
      this.x = this.startX - offsetX
      line(this.x -1, this.y, this.x, this.y + this.height)
      fill(this.color)
      noStroke()
      rect(this.x, this.y, this.getWidth(), this.height)
      textSize(18)
      
      fill(0)
      text(this.name, this.x + 10, this.y+10, this.getWidth() - 20, this.height-20)
    //   console.log(this.x + playheadOffset)
      if(this.x < playheadOffset && !this.hasFired){
        let msg;
        if(this.data.indexOf("ampFollow") > -1){
          ampFollow = true
          setTimeout(function(){ampFollow=false}, this.duration * 1000)
        }
        else if(this.data)
          msg = this.data
        else
          msg = this.type + " " + this.name
        sendToClient(msg)
        
        this.hasFired = true
      }
      if(this.x + this.getWidth() > playheadOffset){
        //   this.hasFired = false;
      }
    }
    edit(){
      createCue(this.startTime)
      $('#cue-name').val(this.name)
      $('#cue-data').val(this.data)
      $('#cue-type').val(this.type)
      $('#cue-duration').val(this.duration)
      $('#submit-cue').off('click')
      $('#submit-cue').on('click', updateCue)
      $('#delete-cue').show()
      console.log(this.name + " available for edit")
    }
    updateFromObj(obj){
      for (const prop in obj){
        this[prop] = obj[prop]
      }
    }
    getWidth() {
      return getPosFromTime(this.startTime + this.duration) - getPosFromTime(this.startTime)
    }

    hasMouse(){
      return (mouseX >= this.x && mouseX <= this.x + this.getWidth()) && (mouseY >= this.y && mouseY <= this.y + cueHeight)
    }
}