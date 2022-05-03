/* eslint-disable react/no-unused-class-component-methods */
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";
import CareerInfo from "./career-info";
import Clubs from "./clubs";
import Jobs from "./jobs";
import Majors from "./majors";

function CareerModal(props) {
  const [career, setCareer] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState("career");
  const [showDropdown, setShowDropdown] = useState(false);

  const {assessment, isReady, translate, setElement, ui} = props;

  const tabs = {
    career: "Career Info",
    clubs: "Clubs",
    majors: "Majors",
    jobs: "Jobs"
  };

  const close = () => { ui.trigger("CareerModal.hide", {props}); };
  const hide = () => { setShow(false); };
  const updateCareer = () => { setCareer(ui.current["CareerModal.career"]); };
  const enableShow = () => { setShow(true); };

  const getSelected = () => tabs[selectedTab];
  const selectTab = (tabName) => { setSelectedTab(tabName); };
  const isSelected = (tabName) => selectedTab === tabName;
  const toggleShowDropdown = () => { setShowDropdown(!showDropdown); };
  const selectDropdown = (tabName) => {
    selectTab(tabName);
    toggleShowDropdown();
  };

  useEffect(() => {
    ui.trigger("CareerModal.initialized", {props});
    ui.on("CareerModal.career", updateCareer);
    ui.on("CareerModal.hide", hide);
    ui.on("CareerModal.show", enableShow);

    return () => {
      ui.off("CareerModal.career", updateCareer);
      ui.off("CareerModal.hide", hide);
      ui.off("CareerModal.show", enableShow);
    };
  }, []);

  useEffect(() => {
    ui.trigger("CareerModal.updated", {props});
  });

  return (
    (show && career) && isReady("results") && (
      <div className={`${style.modal} ${style.container}`} role="dialog" ref={setElement}>
        <section className={style.modalContainer}>
          <div className={style.modalContent}>
            <div className={style.header}>
              <div>Career Details</div>
              <div>
                <Icon aria-label={translate("close")} className={style.close} icon={faTimes} onClick={close} tabIndex="-1" />
              </div>
            </div>
            <hr className={style.grayDivider} />
            <div className={style.careerContainer}>
              <img className={style.image} alt={career.title} src={career.picture} />
              <div className={style.careerDetails}>
                <div className={style.title}>{career.title}</div>
                <div className={style.description}>{career.description}</div>
              </div>
            </div>
            <div className={style.content}>
              <div className={style.contentTabs}>
                <ModalTab className={isSelected("career") ? style.navButtonActive : style.navButton} onClick={() => selectTab("career")}>
                  Career Info
                  <hr className={isSelected("career") ? style.blueDivider : style.grayDivider} />
                </ModalTab>
                <ModalTab className={isSelected("clubs") ? style.navButtonActive : style.navButton} onClick={() => selectTab("clubs")}>
                  Clubs
                  <hr className={isSelected("clubs") ? style.blueDivider : style.grayDivider} />
                </ModalTab>
                <ModalTab className={isSelected("majors") ? style.navButtonActive : style.navButton} onClick={() => selectTab("majors")}>
                  Majors
                  <hr className={isSelected("majors") ? style.blueDivider : style.grayDivider} />
                </ModalTab>
                <ModalTab className={isSelected("jobs") ? style.navButtonActive : style.navButton} onClick={() => selectTab("jobs")}>
                  Jobs
                  <hr className={isSelected("jobs") ? style.blueDivider : style.grayDivider} />
                </ModalTab>
                <div className={style.dropdownContainer}>
                  <button type="button" className={style.dropdownButton} onClick={() => toggleShowDropdown()}>{getSelected()}</button>
                  {showDropdown && (
                    <div className={style.dropdown}>
                      {!isSelected("career") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("career")}>Career Info</ModalTab>
                      )}
                      {!isSelected("clubs") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("clubs")}>Clubs</ModalTab>
                      )}
                      {!isSelected("majors") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("majors")}>Majors</ModalTab>
                      )}
                      {!isSelected("jobs") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("jobs")}>Jobs</ModalTab>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {isSelected("career") && <CareerInfo assessment={assessment} translate={translate} career={career} />}
              {isSelected("clubs") && <Clubs />}
              {isSelected("majors") && <Majors majors={career.majors} />}
              {isSelected("jobs") && <Jobs />}
            </div>
          </div>
        </section>
      </div>
    )
  );
}
CareerModal.propTypes = {
  assessment: PropTypes.shape({
    personality_traits: PropTypes.arrayOf(
      PropTypes.shape({
        personality_trait: PropTypes.shape({
          definition: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        }).isRequired,
        score: PropTypes.number.isRequired
      })
    )
  }),
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired,
  setElement: PropTypes.func.isRequired
};
CareerModal.defaultProps = {
  assessment: null
};

function ModalTab({className, onClick, children}) {
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
ModalTab.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};
export {CareerModal as Component};
export default withTraitify(CareerModal);
