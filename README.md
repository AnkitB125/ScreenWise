# SIT725-ScreenWise
Excessive screen time by children can cause negative physical and mental effects. Hwever, enforcing limited screen time typically fails to developed appropriate self-awareness, discipline and balance. ScreenWise offers a tool to achieve this by rewarding positive behaviour and develops a child's sense of responsibility. It also facilitates parental use of management and monitoring of a child's screen time to support their child's well-being and development.

Basically, a child can earn screen time by partaking in offline activities. Parents can assign different value to online and offline activites, encouraging particular types over others and setting up the systems of reward. 

To set up ScreenWise, an account for the child will need to be created, which requires the name for the child, a points value per minute of screen time and the amount of points that a child can earn and use per day.   

PRIVACY CONCERNS
A general note should be made given the primacy of child protection and data. This is covered by the Australia Privacy Act 1988. ScreenWise is designed for personal and local use, managed by the parent, and requires no data be transmitted beyond the local machine where it is stored. Data stored is all that is enterd by the aprent and child and does not need to reflect accuracy or identity. Given online activities are typically designed for internet connection, parents prevailing practices given the use of ScreenWise and so it is encouraged to be aware, follow and adhere to any guidelines. For futher information:
https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/use-and-disclosure-of-personal-information
https://childrenandmedia.org.au/resources/australian-privacy-law-is-it-protecting-our-children-when-online

STARTING THE APPLICATION
Currently, ScreenWise is run from the command line using node server.js, or npm start. If the application fails to run on the intial attempt, the node_modules folder will need to be deleted, followed by running the command npm i. When running, the command line will provide a link to open up parent's preferred browser. Upon starting the application, a user will initally be direct to the home page, which also serves as the Child's portal.

SETTING UP SCREENWISE
Once the home page is open, a parent must create a username and password for them to access the administraion of the application. Having followed the prompts and logging in, a parent is taken to the Parent Home page from where a child accountcan be created via the MANAGE CHILD RECORDS button. Activies can be set up via the MANAGE OFFLINE ACTIVITIES and MANAGE ONLINE ACTIVITIES buttons.

MANAGING AND CHANGING CHILD AND ACTIVITY RECORDS
Multiple child accounts can be created and more online and offline activites can be created or edited at any subsequent time via the same buttons initially used to set up ScreenWise. 

EARNING AND USING POINTS 
Once ScreenWise has been setFrom the child home page, the child can earn points by entering an offline activity peformed and the duration of performance. This is done via the EARN POINTS BUTTON from the child home. Points can be used by starting the timer, via the TIMER button. IMPORTANT: Once the timer has started, the refreshing browser page currently cancle she timer and no points will be earned. 

MONITORING USAGE
A child can view their usage via the VIEW SCREEN TIME button from the child home page. A parent can view a child's screen time usage through the CHILD DASHBOARD button via the parent home page. This also shows the activities that the child has performed.

TECHNOLOGIES USED
ScreenWise was develoepd using html, css and javascript, utilising the power of node.js to run the application and using libraries to support mongoDB, materialise. Any unit testing configured is achvied via Chai and Mocha.

MongoDB needs to be installed on the local machine: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#std-label-install-mdb-community-windows

CREDITS
The idea and inspiration for ScreenWise cam from Karen Tremlow, who also project manager, scrum master and developer of core code. Front End/UX/UI was developed by Pascaline Jepkemboi. Backend development and devops was conducted by Ankit Bhardwaj. Project admin, QA and testing was lead by Paul Higham.