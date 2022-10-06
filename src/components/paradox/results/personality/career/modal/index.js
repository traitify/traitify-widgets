import {faTimes} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import Clubs from "./clubs";
import Info from "./info";
import Jobs from "./jobs";
import Majors from "./majors";
import style from "./style.scss";

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
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

function CareerModal(props) {
  const {assessment, isReady, translate, setElement, ui} = props;
  const [career, setCareer] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedTab, setSelectedTab] = useState("career");
  const [showDropdown, setShowDropdown] = useState(false);
  const state = {};

  useDidMount(() => { ui.trigger("CareerModal.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("CareerModal.updated", {props, state}); });
  useEffect(() => {
    const enableShow = () => { setShow(true); };
    const hide = () => { setShow(false); };
    const updateCareer = () => { setCareer(ui.current["CareerModal.career"]); };

    ui.on("CareerModal.career", updateCareer);
    ui.on("CareerModal.hide", hide);
    ui.on("CareerModal.show", enableShow);

    return () => {
      ui.off("CareerModal.career", updateCareer);
      ui.off("CareerModal.hide", hide);
      ui.off("CareerModal.show", enableShow);
    };
  }, []);

  const {clubs, majors, inline_jobs: inlineJobs, jobs} = career || {};
  const tabs = {
    career: "Career Info",
    clubs: "Clubs",
    majors: "Majors",
    jobs: "Jobs"
  };

  const close = () => { ui.trigger("CareerModal.hide", {props}); };
  const getSelected = () => tabs[selectedTab];
  const selectTab = (tabName) => { setSelectedTab(tabName); };
  const isSelected = (tabName) => selectedTab === tabName;
  const toggleShowDropdown = () => { setShowDropdown(!showDropdown); };
  const selectDropdown = (tabName) => {
    selectTab(tabName);
    toggleShowDropdown();
  };

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
                {clubs?.length > 0 && (
                  <ModalTab className={isSelected("clubs") ? style.navButtonActive : style.navButton} onClick={() => selectTab("clubs")}>
                    Clubs
                    <hr className={isSelected("clubs") ? style.blueDivider : style.grayDivider} />
                  </ModalTab>
                )}
                {majors?.length > 0 && (
                  <ModalTab className={isSelected("majors") ? style.navButtonActive : style.navButton} onClick={() => selectTab("majors")}>
                    Majors
                    <hr className={isSelected("majors") ? style.blueDivider : style.grayDivider} />
                  </ModalTab>
                )}
                {!inlineJobs && jobs?.length > 0 && (
                  <ModalTab className={isSelected("jobs") ? style.navButtonActive : style.navButton} onClick={() => selectTab("jobs")}>
                    Jobs
                    <hr className={isSelected("jobs") ? style.blueDivider : style.grayDivider} />
                  </ModalTab>
                )}
                <div className={style.dropdownContainer}>
                  <button type="button" className={style.dropdownButton} onClick={() => toggleShowDropdown()}>{getSelected()}</button>
                  {showDropdown && (
                    <div className={style.dropdown}>
                      {!isSelected("career") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("career")}>Career Info</ModalTab>
                      )}
                      {clubs?.length > 0 && !isSelected("clubs") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("clubs")}>Clubs</ModalTab>
                      )}
                      {majors?.length > 0 && !isSelected("majors") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("majors")}>Majors</ModalTab>
                      )}
                      {!inlineJobs && jobs?.length > 0 && !isSelected("jobs") && (
                        <ModalTab className={style.dropdownItem} onClick={() => selectDropdown("jobs")}>Jobs</ModalTab>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {isSelected("career") && <Info assessment={assessment} translate={translate} career={career} />}
              {clubs?.length > 0 && isSelected("clubs") && <Clubs clubs={clubs} />}
              {majors?.length > 0 && isSelected("majors") && <Majors majors={majors} />}
              {!inlineJobs && jobs?.length > 0 && isSelected("jobs") && <Jobs jobs={jobs} translate={translate} />}
            </div>
          </div>
        </section>
      </div>
    )
  );
}

CareerModal.defaultProps = {assessment: null};
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
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {CareerModal as Component};
export default withTraitify(CareerModal);
