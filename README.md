step 1 - Install the module

cd ~/MagicMirror/modules
git clone https://github.com/linhnymoomeow/MMM-TodoList

Step 2 - Add module to ~MagicMirror/config/config.js
Add this configuration into config.js file's

{
            module: "MMM-TodoList",
            header: "To Do List",
            position: "top_left", 
            config: {
				          email: "dominguezcordova15@gmail.com", 
					        uid: "OmEgpKKFO2eD8HJcJDwYFn5eggG2", 
                  updateInterval: 300000, 
                  onlyShowUnchecked: true,
        			    maxItemsInList: 10,
        			    fade: true,
        			    fadePoint: 0.5,
        			    animationSpeed: 2000,
        			    textAlign: 'center'
			}
          },
