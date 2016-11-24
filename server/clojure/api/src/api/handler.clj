(ns api.handler
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [cheshire.core :as json]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

(defn pong [req]
  (json/generate-string {:message "Pong"}))

(defroutes app-routes
  (GET "/ping" [] pong)
  (route/not-found "Not Found"))

(def app
  (wrap-defaults app-routes site-defaults))
