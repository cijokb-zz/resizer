//TODO: Bug: once mouse is moved while pressing on the handles and out of the window, the element is resizing on mouse move
//TODO: automactically adjusting the resizer based on the element inside
//TODO: prevent reduicng the size beyond the element size

import React, { Component } from "react";

export default class AllResizer extends Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.stopResize = this.stopResize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.resRef = React.createRef();
    this.contRef = React.createRef();
    this.original_height = 0;
    this.original_width = 0;
    this.original_x = 0;
    this.original_y = 0;
    this.original_mouse_x = 0;
    this.original_mouse_y = 0;
    this.currentResizer = null;
  }
  onMouseDown(e) {
    console.log("mouse down");
    e.preventDefault();
    const element = this.contRef.current;
    this.original_width = parseFloat(
      window
        .getComputedStyle(element, null)
        .getPropertyValue("width")
        .replace("px", "")
    );
    this.original_height = parseFloat(
      window
        .getComputedStyle(element, null)
        .getPropertyValue("height")
        .replace("px", "")
    );
    this.original_x = element.getBoundingClientRect().left;
    this.original_y = element.getBoundingClientRect().top;
    this.original_mouse_x = e.pageX;
    this.original_mouse_y = e.pageY;
    this.currentResizer = e.target;
    console.log("addEventListener");
    window.addEventListener("mousemove", this.handleResize);
    window.addEventListener("mouseup", this.stopResize);
  }

  checkContainerLimit(parentElement, element, position) {
    let result = true;
    switch (position) {
      case "bottom-right":
        result =
          parentElement.getBoundingClientRect().right >
          element.getBoundingClientRect().right + 20;
        break;
      case "bottom-left":
        result =
          parentElement.getBoundingClientRect().left <
          element.getBoundingClientRect().left;
        break;
      case "top-right":
        break;
      case "top-left":
        break;
      case "middle-top":
        result =
          parentElement.getBoundingClientRect().top <
          element.getBoundingClientRect().top;
        break;
      case "middle-bottom":
        result =
          parentElement.getBoundingClientRect().bottom >
          element.getBoundingClientRect().bottom;
        break;
      default:
        result = true;
        break;
    }
    return result;
  }

  handleResize(e) {
    e.preventDefault();

    const element = this.contRef.current;
    const minimum_size = 20;
    const parentElement = this.contRef.current.parentElement;

    //TODO: do we need top and left calcualtion
    const { top, left } = { top: 0, left: 0 };

    let width = this.original_width + (e.pageX - this.original_mouse_x);
    let height = this.original_height + (e.pageY - this.original_mouse_y);
    switch (this.currentResizer.className) {
      case "resizer bottom-right":
        console.log("bottom-right");
        width = this.original_width + (e.pageX - this.original_mouse_x);
        height = this.original_height + (e.pageY - this.original_mouse_y);
        console.log("bottom-right");
        if (
          this.checkContainerLimit(parentElement, element, "bottom-right") ||
          e.pageX < this.original_mouse_x
        ) {
          if (width > minimum_size) {
            element.style.width = width + "px";
          }
          if (height > minimum_size) {
            element.style.height = height + "px";
          }
        }
        break;
      case "resizer bottom-left":
        console.log(" bottom-left");
        height = this.original_height + (e.pageY - this.original_mouse_y);
        width = this.original_width - (e.pageX - this.original_mouse_x);
        if (this.checkContainerLimit(parentElement, element, "bottom-left")) {
          if (height > minimum_size) {
            element.style.height = height + "px";
          }
          if (width > minimum_size) {
            element.style.width = width + "px";
            element.style.left =
              this.original_x + (e.pageX - this.original_mouse_x) - left + "px";
          }
        }
        break;
      case "resizer top-right":
        console.log("top-right");
        width = this.original_width + (e.pageX - this.original_mouse_x);
        height = this.original_height - (e.pageY - this.original_mouse_y);
        if (width > minimum_size) {
          element.style.width = width + "px";
        }
        if (height > minimum_size) {
          element.style.height = height + "px";
          element.style.top =
            this.original_y + (e.pageY - this.original_mouse_y) - top + "px";
        }
        break;
      case "resizer top-left":
        console.log("top-left");
        width = this.original_width - (e.pageX - this.original_mouse_x);
        height = this.original_height - (e.pageY - this.original_mouse_y);
        if (width > minimum_size) {
          element.style.width = width + "px";
          element.style.left =
            this.original_x + (e.pageX - this.original_mouse_x) - left + "px";
        }
        if (height > minimum_size) {
          element.style.height = height + "px";
          element.style.top =
            this.original_y + (e.pageY - this.original_mouse_y) - top + "px";
        }
        break;
      case "resizer middle-top":
        //TODO:
        console.log("middle-top");
        width = this.original_width + (e.pageX - this.original_mouse_x);
        height = this.original_height - (e.pageY - this.original_mouse_y);
        if (this.checkContainerLimit(parentElement, element, "middle-top")) {
          if (height > minimum_size) {
            element.style.height = height + "px";
            element.style.top =
              this.original_y + (e.pageY - this.original_mouse_y) - top + "px";
          }
        }
        break;
      case "resizer middle-bottom":
        //TODO:
        console.log(" middle-bottom");
        width = this.original_width + (e.pageX - this.original_mouse_x);
        height = this.original_height + (e.pageY - this.original_mouse_y);
        if (this.checkContainerLimit(parentElement, element, "middle-bottom")) {
          if (height > minimum_size) {
            element.style.height = height + "px";
          }
        }
        break;
    }
  }

  stopResize() {
    console.log("stopResize");
    window.removeEventListener("mousemove", this.handleResize);
  }
  componentDidMount() {}
  componentWillUnmount() {
    //window.removeEventListener("mousemove", this.handleResize);
    window.removeEventListener("mouseup", this.stopResize);
  }
  render() {
    return (
      <div className="resizable" ref={this.contRef}>
        <div className="resizers" ref={this.resRef}>
          {this.props.children}
          <div className="resizer top-left" onMouseDown={this.onMouseDown} />
          <div className="resizer top-right" onMouseDown={this.onMouseDown} />
          <div className="resizer middle-top" onMouseDown={this.onMouseDown} />
          <div
            className="resizer middle-bottom"
            onMouseDown={this.onMouseDown}
          />
          <div className="resizer bottom-left" onMouseDown={this.onMouseDown} />
          <div
            className="resizer bottom-right"
            onMouseDown={this.onMouseDown}
          />
        </div>
      </div>
    );
  }
}

// import React, { Component } from "react";

// export default class Resizer extends Component {
//   constructor(props) {
//     super(props);
//     this.handleResize = this.handleResize.bind(this);
//     this.stopResize = this.stopResize.bind(this);
//     this.onMouseDown = this.onMouseDown.bind(this);
//     this.resRef = React.createRef();
//     this.contRef = React.createRef();
//     this.original_height = 0;
//     this.original_width = 0;
//     this.original_x = 0;
//     this.original_y = 0;
//     this.original_mouse_x = 0;
//     this.original_mouse_y = 0;
//     this.currentResizer = null;
//   }
//   onMouseDown(e) {
//     console.log("mouse down");
//     e.preventDefault();
//     const element = this.contRef.current;
//     this.original_width = parseFloat(
//       window
//         .getComputedStyle(element, null)
//         .getPropertyValue("width")
//         .replace("px", "")
//     );
//     this.original_height = parseFloat(
//       window
//         .getComputedStyle(element, null)
//         .getPropertyValue("height")
//         .replace("px", "")
//     );
//     this.original_x = element.getBoundingClientRect().left;
//     this.original_y = element.getBoundingClientRect().top;
//     this.original_mouse_x = e.pageX;
//     this.original_mouse_y = e.pageY;
//     this.currentResizer = e.target;
//     console.log("addEventListener");
//     window.addEventListener("mousemove", this.handleResize);
//     window.addEventListener("mouseup", this.stopResize);
//   }
//   handleResize(e) {
//     e.preventDefault();
//     console.log("handleResize");
//     //const currentResizer = this.resRef.current;
//     const element = this.contRef.current;
//     const minimum_size = 20;
//     let width = 0;
//     let height = 0;
//     switch (this.currentResizer.className) {
//       case "resizer bottom-right":
//         console.log("bottom-right");
//         width = this.original_width + (e.pageX - this.original_mouse_x);
//         height = this.original_height + (e.pageY - this.original_mouse_y);
//         if (width > minimum_size) {
//           element.style.width = width + "px";
//         }
//         if (height > minimum_size) {
//           element.style.height = height + "px";
//         }
//         break;
//       case "resizer bottom-left":
//         console.log(" bottom-left");
//         height = this.original_height + (e.pageY - this.original_mouse_y);
//         width = this.original_width - (e.pageX - this.original_mouse_x);
//         if (height > minimum_size) {
//           element.style.height = height + "px";
//         }
//         if (width > minimum_size) {
//           element.style.width = width + "px";
//           element.style.left =
//             this.original_x + (e.pageX - this.original_mouse_x) + "px";
//         }
//         break;
//       case "resizer top-right":
//         console.log("top-right");
//         width = this.original_width + (e.pageX - this.original_mouse_x);
//         height = this.original_height - (e.pageY - this.original_mouse_y);
//         if (width > minimum_size) {
//           element.style.width = width + "px";
//         }
//         if (height > minimum_size) {
//           element.style.height = height + "px";
//           element.style.top =
//             this.original_y + (e.pageY - this.original_mouse_y) + "px";
//         }
//         break;
//       case "resizer top-left":
//         console.log("top-left");
//         width = this.original_width - (e.pageX - this.original_mouse_x);
//         height = this.original_height - (e.pageY - this.original_mouse_y);
//         if (width > minimum_size) {
//           element.style.width = width + "px";
//           element.style.left =
//             this.original_x + (e.pageX - this.original_mouse_x) + "px";
//         }
//         if (height > minimum_size) {
//           element.style.height = height + "px";
//           element.style.top =
//             this.original_y + (e.pageY - this.original_mouse_y) + "px";
//         }
//         break;
//       case "resizer middle-top":
//         //TODO:
//         console.log("middle-top");
//         width = this.original_width + (e.pageX - this.original_mouse_x);
//         height = this.original_height - (e.pageY - this.original_mouse_y);
//         // if (width > minimum_size) {
//         //   element.style.width = width + "px";
//         // }
//         if (height > minimum_size) {
//           element.style.height = height + "px";
//           element.style.top =
//             this.original_y + (e.pageY - this.original_mouse_y) + "px";
//         }
//         break;
//       case "resizer middle-bottom":
//         //TODO:
//         console.log(" middle-bottom");
//         console.log("bottom-right");
//         width = this.original_width + (e.pageX - this.original_mouse_x);
//         height = this.original_height + (e.pageY - this.original_mouse_y);
//         // if (width > minimum_size) {
//         //   element.style.width = width + "px";
//         // }
//         if (height > minimum_size) {
//           element.style.height = height + "px";
//         }
//         break;
//     }
//     // if (currentResizer.classList.contains("bottom-right")) {
//     //   const width = this.original_width + (e.pageX - this.original_mouse_x);
//     //   const height = this.original_height + (e.pageY - this.original_mouse_y);
//     //   if (width > minimum_size) {
//     //     element.style.width = width + "px";
//     //   }
//     //   if (height > minimum_size) {
//     //     element.style.height = height + "px";
//     //   }
//     // } else if (currentResizer.classList.contains("bottom-left")) {
//     //   const height = this.original_height + (e.pageY - this.original_mouse_y);
//     //   const width = this.original_width - (e.pageX - this.original_mouse_x);
//     //   if (height > minimum_size) {
//     //     element.style.height = height + "px";
//     //   }
//     //   if (width > minimum_size) {
//     //     element.style.width = width + "px";
//     //     element.style.left =
//     //       this.original_x + (e.pageX - this.original_mouse_x) + "px";
//     //   }
//     // } else if (currentResizer.classList.contains("top-right")) {
//     //   const width = this.original_width + (e.pageX - this.original_mouse_x);
//     //   const height = this.original_height - (e.pageY - this.original_mouse_y);
//     //   if (width > minimum_size) {
//     //     element.style.width = width + "px";
//     //   }
//     //   if (height > minimum_size) {
//     //     element.style.height = height + "px";
//     //     element.style.top =
//     //       this.original_y + (e.pageY - this.original_mouse_y) + "px";
//     //   }
//     // } else {
//     //   console.log("inside");
//     //   const width = this.original_width - (e.pageX - this.original_mouse_x);
//     //   const height = this.original_height - (e.pageY - this.original_mouse_y);
//     //   if (width > minimum_size) {
//     //     element.style.width = width + "px";
//     //     element.style.left =
//     //       this.original_x + (e.pageX - this.original_mouse_x) + "px";
//     //   }
//     //   if (height > minimum_size) {
//     //     element.style.height = height + "px";
//     //     element.style.top =
//     //       this.original_y + (e.pageY - this.original_mouse_y) + "px";
//     //   }
//     // }
//   }

//   stopResize() {
//     console.log("stopResize");
//     window.removeEventListener("mousemove", this.handleResize);
//   }
//   componentDidMount() {}
//   componentWillUnmount() {
//     //window.removeEventListener("mousemove", this.handleResize);
//     window.removeEventListener("mouseup", this.stopResize);
//   }
//   render() {
//     return (
//       <div className="resizable" ref={this.contRef}>
//         <div className="resizers" ref={this.resRef}>
//           {this.props.children}
//           <div className="resizer top-left" onMouseDown={this.onMouseDown} />
//           <div className="resizer top-right" onMouseDown={this.onMouseDown} />
//           <div className="resizer middle-top" onMouseDown={this.onMouseDown} />
//           <div
//             className="resizer middle-bottom"
//             onMouseDown={this.onMouseDown}
//           />
//           <div className="resizer bottom-left" onMouseDown={this.onMouseDown} />
//           <div
//             className="resizer bottom-right"
//             onMouseDown={this.onMouseDown}
//           />
//         </div>
//       </div>
//     );
//   }
// }
