# OT security simple assessment

## Directory Structure
```
.
├── README.md
│  ├── _src  // Development Directory
│  │   │── index.js  // Entry Point
│  │   │── sass
│  │   └── vue
│  │      │── assets
│  │      └── components
│  └── deploy  // Public Directory
├── webpack.config.js // Environment Configuration
└── package.json
```

## Getting Started

### Environment
nodejs v16.16.0


### install node package module
```
$ npm install
```

### Browser Sync

```
$ npm run server
```

### Release

```
$ npm run build
```

## Note
### About the Result Page.
#### Display diagnostic results based on query parameter values.
  * tt - Overall score
  * or - People score
  * op - Process score
  * te - Technology score
  * su - Supply Chain Management for Factory Assets score
  * kp - Sequence for Generating Evaluation Statements for Each Category

#### Regarding the entered response content
The response content is only stored in Vue (JS) as entered.  
Therefore, its display or non-display depends on the method of displaying the result page.  
1. When transitioning from entering responses to the result page.  
  → The response content stored in JavaScript will be displayed.
2. When directly loading the result page.  
  → The response content will not be displayed.

## Library
### [Vue](https://vuejs.org/guide/introduction.html)
Vue is used throughout the diagnostic app.

### [Vuelidate](https://vuelidate-next.netlify.app/)
Version.2  
We are using a Vue-compatible validation plugin throughout the entire question page.  
The usage is to check for unanswered responses on the diagnosis page.

### [Chart.js](https://www.chartjs.org/docs/3.7.1/)
Version.3.7.1   
The usage is to generate radar charts on the result page.

## Release History
* 2023/12/5 Publish

