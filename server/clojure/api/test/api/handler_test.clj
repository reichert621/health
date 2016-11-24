(ns api.handler-test
  (:require [clojure.test :refer :all]
            [ring.mock.request :as mock]
            [cheshire.core :as json]
            [api.handler :refer :all]))

(deftest test-app
  (testing "ping route"
    (let [response (app (mock/request :get "/ping"))]
      (is (= (:status response) 200))
      (is (= (:body response)
        (json/generate-string {:message "Pong"})))))

  (testing "not-found route"
    (let [response (app (mock/request :get "/invalid"))]
      (is (= (:status response) 404)))))
