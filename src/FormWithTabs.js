import React, { Component } from "react";
import deepequal from "deep-equal";
import PropTypes from "prop-types";
import { isDevelopment } from "./utils";
import Tabs from "./Tabs";

const formWithTabs = (FormComponent, TabComponent = Tabs) => {
  class FormWithTabs extends Component {
    constructor(props) {
      super(props);

      let { formData } = this.props;
      this.state = { formData };
    }

    sameData = formData => {
      return (
        deepequal(this.props.formData, formData) ||
        deepequal(this.formData, formData)
      );
    };

    componentWillReceiveProps({ formData }) {
      if (!this.sameData(formData)) {
        this.formData = formData;
        this.setState({ formData });
      }
    }

    handleOnChange = state => {
      this.formData = state.formData;
      this.setState({ formData: state.formData });
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    shouldComponentUpdate(nextProps, nextState) {
      let sameProps = deepequal(
        Object.assign({}, this.props, { formData: {} }),
        Object.assign({}, nextProps, { formData: {} })
      );
      let sameState = deepequal(
        Object.assign({}, this.state, { formData: this.formData }),
        nextState
      );
      let sameData = this.sameData(nextProps.formData);
      return !sameProps || !sameState || !sameData;
    }

    renderForm = () => {
      if (this.props.schema) {
        let { formData } = this.state;
        let configs = Object.assign({}, this.props, {
          formData,
          onChange: this.handleOnChange,
        });
        return (
          <FormComponent {...configs}>
            <div />
          </FormComponent>
        );
      } else {
        return <div />;
      }
    };

    renderTabs = () => {
      let { tabs, activeTab, onTabChange } = this.props;
      return (
        <TabComponent
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      );
    };

    render() {
      return (
        <div>
          {this.renderForm()}
          {this.renderTabs()}
        </div>
      );
    }
  }

  if (isDevelopment()) {
    FormWithTabs.propTypes = {
      tabs: PropTypes.array,
    };
  }

  return FormWithTabs;
};

export default formWithTabs;
