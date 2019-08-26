import React from "react";
import { debounce } from "lodash"

class Truncate extends React.Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
        this.debounceResize = debounce(this.onResult, 200);
        this.isSupportNativeClamp = false;

        this.text = "";
        this.lineHeight = 0;

        this.splitOnChars = [".", "-", "–", "—", " "];
        this.splitChar = this.splitOnChars[0];
        this.chunks = null;
        this.lastChunk = null;

        this.truncatePollyfill = false;
    }
    componentDidMount() {
        this.isSupportNativeClamp = "webkitLineClamp" in document.body.style;
        this.text = this.containerRef.current.innerHTML;
        this.processTruncate();
        this.onResult();
        window.addEventListener("resize", this.debounceResize, false);
    }
    componentDidUpdate() {
        this.processTruncate();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.debounceResize, false);
    }
    processTruncate = () => {
        if (this.isSupportNativeClamp) {
            const style = this.containerRef.current.style;
            style.overflow = "hidden";
            style.textOverflow = "ellipsis";
            style.webkitBoxOrient = "vertical";
            style.display = "-webkit-box";
            style.webkitLineClamp = this.props.countLines;
        } else {
            this.lineHeight = this.getLineHeight();
            if (this.containerRef.current.offsetHeight > this.lineHeight * this.props.countLines) {
                this.truncatePollyfill = true;
                this.truncate();
            }
        }
    }
    onResult = () => {
        if (this.isSupportNativeClamp) {
            this.props.onResult(this.containerRef.current.scrollWidth > this.containerRef.current.clientWidth || this.containerRef.current.scrollHeight > this.containerRef.current.clientHeight);
        } else {
            this.props.onResult(this.truncatePollyfill);
        }
    }
    truncate = () => {
        if (!this.chunks) {
            if (this.splitOnChars.length > 0) {
                this.splitChar = this.splitOnChars.shift();
            } else {
                this.splitChar = "";
            }
            this.chunks = this.containerRef.current.innerHTML.split(this.splitChar);
        }
      
        if (this.chunks.length > 1) {
            this.lastChunk = this.chunks.pop();
            this.containerRef.current.innerHTML = this.chunks.join(this.splitChar) + this.props.ellipsisChars;
        } else {
            this.chunks = null;
        }

        if (this.chunks) {
            if (this.containerRef.current.offsetHeight <= this.lineHeight * this.props.countLines) {
                if (this.splitOnChars.length >= 0 && this.splitChar !== "") {
                    this.containerRef.current.innerHTML = this.chunks.join(this.splitChar) + this.splitChar + this.lastChunk;
                    this.chunks = null;
                } else {
                    return;
                }
            }
        } else if (this.splitChar === "") {
            return;
        }
      
        this.truncate();
    }
    getLineHeight = () => {
        const lineHeight = this.сomputedStyle("line-height");

        if (lineHeight === "normal") {
            return Math.ceil(parseFloat(this.сomputedStyle("font-size")) * 1.2);
        }
        return Math.ceil(parseFloat(lineHeight));
    }
    сomputedStyle = (styleName) => {
        return document.defaultView.getComputedStyle(this.containerRef.current, null).getPropertyValue(styleName);
    }
    render() {
        return (
            <div ref={this.containerRef}>
                {this.props.children}
            </div>
        );
    }
}

export default Truncate;