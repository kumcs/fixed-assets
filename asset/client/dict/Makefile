all:
	find .. -name '*.ui' -exec echo FORMS       +={} \; >  ts.pro
	find .. -name '*.js' -exec echo SOURCES     +={} \; >> ts.pro
	find * -name '*.ts'  -exec echo TRANSLATIONS+={} \; >> ts.pro

	lupdate -no-obsolete ts.pro
	lrelease ts.pro

	echo '<qm>' > translations.xml

	for TRANSLATION in $$(find * -name '*.qm' | sort) ; do \
	  if ! expr $$TRANSLATION : '.*base.*' ; then \
	    echo '  <loadqm file="client/dict/'$$TRANSLATION'"/>' >> translations.xml ; \
	  fi \
	done

	echo '</qm>' >> translations.xml

clean:
	rm -f *.qm
	rm -f translations.xml ts.pro
