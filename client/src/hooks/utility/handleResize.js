export default function calcHeight(value) {
    let numberOfLineBreaks = (value.match(/\r|\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newHeight = 2 + numberOfLineBreaks * 2 + 0.5 + 0.2
    if (newHeight <= 6){
      return newHeight;
    }else{
      newHeight = 6
      return newHeight
    }

  }