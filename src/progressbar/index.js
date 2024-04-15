import './index.css'

export default {
  template: `<svg version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 28.7 29.3"
                 style="enable-background:new 0 0 28.7 29.3;" xml:space="preserve">
<path fill="#4B47BE" d="M6.2,0.1h6.6c3.2,0,5.9,0.6,8.3,1.8s4.2,2.9,5.6,5.1s2,4.7,2,7.7c0,2.9-0.7,5.5-2,7.7c-1.3,2.2-3.2,3.9-5.6,5.1c-2.4,1.2-5.2,1.8-8.3,1.8H0V0.1h4.8v6.1v9.1c0,5.2,4.3,9.5,9.5,9.5c5.2,0,9.5-4.2,9.5-9.5c0-8.7-8.3-8-14.1-9.2C7.7,5.8,6.2,3.9,6.2,1.8C6.2,0.9,6.2,0.1,6.2,0.1z"/>
</svg>
<div class="progress" data-label="Loading..."></div>`,
  data: [{
    key: 'wellsJson',
    label: 'wells'
  },
  {
    key: 'fieldsJson',
    label: 'fields'
  },
  {
    key: 'intakesJson',
    label: 'intakes'
  },
  {
    key: 'licenseJson',
    label: 'license'
  }]
}