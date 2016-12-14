import React from 'react';

const texts = {
    en: {
        'Settings': 'Settings',
        'Language': 'Language'
    },
    es: {
        'Settings': 'Configuración',
        'Language': 'Idioma'
    }
};

var Settings = React.createClass({
    propTypes: {
        setLanguage: React.PropTypes.func.isRequired,
        language: React.PropTypes.string,
        modal: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            language: 'en',
            modal: 'settings'
        };
    },

    setLanguage(event) {
        if (event.currentTarget.value !== this.props.language) {
            this.props.setLanguage(event.currentTarget.value);
        }
    },

    render: function(){
        var text = texts[this.props.language];

        if (this.props.modal === 'settings') {
            return(
                <div id="settings">
                    <h2>{text['Settings']}</h2>
                    <h3>{text['Language']}</h3>
                    <br />
                    <input type="radio"
                           name="en"
                           value='en'
                           checked={this.props.language === 'en'}
                           onChange={this.setLanguage} /> English
                    <br /><br />
                    <input type="radio"
                           name="es"
                           value='es'
                           checked={this.props.language === 'es'}
                           onChange={this.setLanguage} /> Español
                </div>
            );
        } else {
            return null;
        }
    }
});

export default Settings;
