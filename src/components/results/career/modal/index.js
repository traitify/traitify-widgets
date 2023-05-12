import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import Icon from "components/common/icon";
import useCareer from "lib/hooks/use-career";
import useComponentEvents from "lib/hooks/use-component-events";
import useFetchModalJobs from "lib/hooks/use-fetch-modal-jobs";
import useJobOptions from "lib/hooks/use-job-options";
import useJobs from "lib/hooks/use-jobs";
import useTranslate from "lib/hooks/use-translate";
import {careerModalShowState} from "lib/recoil";
import Clubs from "./clubs";
import Details from "./details";
import Jobs from "./jobs";
import Majors from "./majors";
import Employers from "./employers";
import Resources from "./resources";
import style from "./style.scss";

export default function CareerModal() {
  useFetchModalJobs();
  const [activeTab, setActiveTab] = useState(null);
  const career = useCareer();
  const {inline_jobs: inlineJobs, job_source: jobSource} = useJobOptions();
  const {fetching, jobs} = useJobs();
  const [show, setShow] = useRecoilState(careerModalShowState);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tabs, setTabs] = useState(null);
  const translate = useTranslate();

  useComponentEvents("CareerModal", {career, show});
  useEffect(() => {
    if(!career) { return; }

    const {clubs, majors, employers, resources} = career;

    const activeTabs = [
      {Component: Details, title: "Career Info"},
      clubs && clubs.length > 0 && {Component: Clubs, title: "Clubs"},
      majors && majors.length > 0 && {Component: Majors, title: "Majors"},
      jobSource && !inlineJobs && !fetching && jobs.length > 0 && {Component: Jobs, title: "Jobs"},
      employers && employers.length > 0 && {Component: Employers, title: "Employers"},
      resources && resources.length > 0 && {Component: Resources, title: "Resources"}
    ].filter(Boolean);

    setTabs(activeTabs);
    setActiveTab(activeTabs[0]);
  }, [career, fetching, jobs]);

  if(!activeTab) { return null; }
  if(!career) { return null; }
  if(!show) { return null; }

  const selectTab = (tab) => {
    setActiveTab(tab);
    setShowDropdown(false);
  };
  const {Component} = activeTab;

  return (
    <div className={`${style.modal} ${style.container}`}>
      <section className={style.modalContainer}>
        <div className={style.modalContent}>
          <div className={style.header}>
            <div>Career Details</div>
            <div>
              <Icon aria-label={translate("close")} className={style.close} icon={faTimes} onClick={() => setShow(false)} tabIndex="-1" />
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
              {tabs.map((tab) => (
                <button key={tab.title} className={activeTab === tab ? style.navButtonActive : style.navButton} onClick={() => selectTab(tab)} type="button">
                  {tab.title}
                  <hr className={activeTab === tab ? style.blueDivider : style.grayDivider} />
                </button>
              ))}
              <div className={style.dropdownContainer}>
                <button className={style.dropdownButton} onClick={() => setShowDropdown(!showDropdown)} type="button">{activeTab.title}</button>
                {showDropdown && (
                  <div className={style.dropdown}>
                    {tabs.map((tab) => (
                      <button key={tab.title} className={style.dropDownItem} onClick={() => selectTab(tab)} type="button">
                        {tab.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Component />
          </div>
        </div>
      </section>
    </div>
  );
}
