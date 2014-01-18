iris = {

    addStyleRule:function(identifier, rule) {
        var ruleStr = ''
        ruleStr += identifier + '{\n';
        for(prop in rule) {
            ruleStr += this.spaces(4) + prop + ':' + rule[prop] + ';\n'
        };
        ruleStr += '}\n\n';
        this.css.push(ruleStr);
    },

    close:function() {
        var nodeList = document.getElementsByClassName('sector');
        for(var i = 0; i < nodeList.length; i++) {
            nodeList[i].className = 'sector sector' + i + 'close';
        };
    },

    open:function() {
        var nodeList = document.getElementsByClassName('sector');
        for(var i = 0; i < nodeList.length; i++) {
            nodeList[i].className = 'sector';
        };
    },

    create:function(element, numSectors, color, time) {
        // define variable used for later calculations (size and rotation)
        this.containerSide = (element.offsetWidth > element.offsetHeight) ? element.offsetWidth : element.offsetHeight;
        this.r = this.containerSide/Math.sqrt(2);
        this.color = color;
        this.time = time;
        this.theta = 2*Math.PI/numSectors;
        this.h = this.r*(1-Math.cos(this.theta/2));
        this.s = 2*this.r*Math.sin(this.theta/2);

        // initialize the html and css arrays with the container information
        this.html = [];
        this.css = [];

        this.sectorStyle = false;
        this.segmentStyle = false;
        this.triangleStyle = false;

        // create the sectors
        var includeCss = true;
        for(var i = 0; i < numSectors; i++) {
            this.html.push(this.sector('sector'+i, includeCss));
            includeCss = false;
        };
        this.styleSectors(numSectors);

        // add the html to the element
        var response = {
            html:this.html.join(''),
            css:this.css.join('')
        };
        this.html.push('<style>\n' + this.css.join('') + '</style>\n');
        element.insertAdjacentHTML('afterbegin', this.html.join(''));
    },

    sector:function(id) {
        var triangle = this.triangle(''),
            segment1 = this.segment('segment1'),
            segment2 = this.segment('segment2');
        if(!this.sectorStyle) {
            this.sectorStyle = true;
            this.addStyleRule('.sector', {
                position:'absolute',
                transition:'-webkit-transform ' + this.time + 's',
                '-webkit-transform-origin':'left top'
            });
            this.addStyleRule('.sector>div', {
                position:'absolute',
                top:'0px',
                left:'0px'
            });
            this.addStyleRule('.segment1', {
                '-webkit-transform-origin':'left top',
                '-webkit-transform':'rotate(-60deg)'
            });
            this.addStyleRule('.segment2', {
                '-webkit-transform-origin':'left bottom',
                '-webkit-transform':'rotate(60deg)'
            });
        };
        return [
            '<div id="', id, '" class="sector">\n',
            triangle, segment1, segment2, '</div>\n'
        ].join('');
    },
    
    segment:function(className) {
        if(!this.segmentStyle) {
            this.segmentStyle = true;
            this.addStyleRule('.segment', {
                width:this.h,
                height:this.s,
                overflow:'hidden'
            });
            this.addStyleRule('.semi', {
                width:this.r,
                height:2*this.r,
                position:'absolute',
                top:-(2*this.r - this.s)/2,
                left:-this.r + this.h,
                'border-radius':'0px ' + this.r + 'px ' + this.r + 'px 0px',
                'background-color':this.color
            });
        };
        return segment = [
            this.spaces(4), '<div class="segment ', className, '">\n',
            this.spaces(8), '<div class="semi"></div>\n',
            this.spaces(4), '</div>\n'
        ].join('');
    },

    spaces:function(n) {
        var str = '';
        for(var i = 0; i < n; i++) {
            str += '\u0020';
        };
        return str;
    },

    styleSectors:function(n) {
        for(var i = 0; i < n; i++) {
            this.addStyleRule('#sector' + i, {
                top:(this.containerSide/2 + this.r*Math.sin(this.theta*i)) + 'px',
                left:(this.containerSide/2 + this.r*Math.cos(this.theta*i)) + 'px',
                '-webkit-transform':'rotate(' + (this.theta*(i+0.5)*180/Math.PI) + 'deg)'
            });
            this.addStyleRule('.sector' + i + 'close', {
                '-webkit-transform':'rotate(' + (this.theta*(i+0.5)*180/Math.PI + 60) + 'deg) !important'
            });
        };
    },

    triangle:function() {
        if(!this.triangleStyle) {
            this.triangleStyle = true;
            this.addStyleRule('.square', {
                width:this.s,
                height:this.s
            });
            this.addStyleRule('.cutout', {
                background:[
                    'radial-gradient(circle ', this.r+1, ' at 50% ',
                    this.s + this.r - this.h, ', transparent 0, transparent ',
                    this.r, 'px, ', this.color, ' ', this.r, 'px)'
                ].join(''),
                '-webkit-transform-origin':'right bottom',
                '-webkit-transform':'rotate(30deg)'
            });
            this.addStyleRule('.slice1', {
                overflow:'hidden',
                '-webkit-transform-origin':'right top',
                '-webkit-transform':'rotate(30deg)'
            });
            this.addStyleRule('.slice2', {
                overflow:'hidden',
                '-webkit-transform-origin':'left top',
                '-webkit-transform':'rotate(30deg)'
            });
        };
        return triangle = [
            this.spaces(4), '<div class="square slice2">\n',
            this.spaces(8), '<div class="square slice1">\n', 
            this.spaces(12), '<div class="cutout square"></div>\n',
            this.spaces(8), '</div>\n',
            this.spaces(4), '</div>\n'
        ].join('');
    }

};
