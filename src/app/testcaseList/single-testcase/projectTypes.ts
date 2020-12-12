import { Observable, Subscription } from 'rxjs';
import { FormControl,FormGroup} from '@angular/forms'
import firebase from 'firebase/app';

export interface userProfile { 
    userAuthenObj: firebase.User,//Receive User obj after login success
    projectLocation?:string;//Demo or User public project ref
    projectOwner?:boolean;
    projectName?:string
    membershipType?:string;
    endMembershipValidity?:Date;
    mainsubsectionKeys?: Observable<mainSectionGroup[]>;
    publicProjectData?: Observable<string[]>;
    ownPublicprojectData?: Observable<string[]>;
    MainSectionData?: Observable<string[]>;
    SubSectionData?: Observable<string[]>;      
   }

export interface TestcaseInfo{
    heading: string;//Heading in testcase list
    subHeading:string;//Sub-Heading in testcase list
    description: string;//Description in testcase view
    stackblitzLink: string;//stackblitzLink in testcase edit/doubleclick
    
}

export interface singleSubsection {//for keys display
    subsectionName: string;
}
export interface mainSectionGroup {//for keys display
    mainsectionDisabled: boolean;
    mainsectionName: string;
    subsectionArr: singleSubsection[];
}

export interface projectFlags
{    
    showCreateTestcase:boolean;//show add or New Testcase based on number of testcases in subsection
    showPaymentpage:boolean;//for expired user-remove it
    showTestcaseEdit:boolean;
    homeNewProject:boolean;
    editDeleteProject:boolean;
    editAddMainsec:boolean;
    editDeleteMainsec:boolean;
    editVisibility:boolean;
    editAddSubSec:boolean;
}

export interface projectVariables
{
    initialMainSection?:string;
    viewSelectedTestcase?:TestcaseInfo;
    subsectionArraydata?:singleSubsection[];
    testcaseInfodata?: Observable<TestcaseInfo[]>;
    testcaseInfoArraydata?: TestcaseInfo[];
    authDataSub?:Subscription;
    loadkeySub?:Subscription;
    mainpagekeySub?:Subscription;
    mypubliclistSub?:Subscription;
}

export interface projectControls{
    subsectionkeysControl: FormControl;//1-Keys come from db and user sub-sec selection will load a doc from demo or public proj
   
    testcaseInfoControl: FormControl; //Displays the selected Testcase details
    createTestcaseControl: FormControl;//User enters a test case name
    publicprojectControl: FormControl;//1-User selects a public project    
    ownPublicprojectControl: FormControl;//1-User selects own public project
    editMainsectionGroup: FormGroup;// user selects a Main section key
    visibilityMainsectionGroup:FormGroup,
    editSubsectionGroup: FormGroup;  // user selects a Sub section key
}
